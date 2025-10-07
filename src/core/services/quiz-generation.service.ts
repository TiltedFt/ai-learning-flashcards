import OpenAI from "openai";
import crypto from "node:crypto";
import { prisma } from "@/shared/lib/db";
import { extractPdfRangeText } from "@/core/services/pdf.service";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const prompt = `You are an expert quiz generator that creates high-quality multiple-choice questions.

INPUT:
- Topic title (context for the questions)
- Source text (the only material to base questions on)

OUTPUT FORMAT (strict JSON):
{
  "questions": [
    {
      "stem": "Question text",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctIndex": 0,
      "explanation": "Optional explanation why the correct answer is right"
    }
  ]
}

QUESTION GENERATION RULES:

1. Generate 3-8 questions depending on text length and complexity:
   - Short text (<500 words): 3-4 questions
   - Medium text (500-1500 words): 5-6 questions
   - Long text (>1500 words): 7-8 questions

2. Question Types - BALANCE BETWEEN UNDERSTANDING AND KEY FACTS:

   **PRIORITIZE (70% of questions):**
   ✅ Conceptual understanding:
      - WHY something happens or is important
      - HOW concepts relate to each other
      - WHAT effects or consequences result
      - Comparisons and relationships
      - Applications and implications
   
   **INCLUDE (30% of questions):**
   ✅ Important facts and key information:
      - Essential dates, names, or terms that are CENTRAL to the topic
      - Key terminology that defines the field
      - Important figures or events that shaped the domain
   
   **AVOID:**
   ❌ Trivial details from examples:
      - Names used only as illustrations (e.g., "What was the company called in example 2?")
      - Arbitrary numbers or specifics that aren't key learning points
      - Details that don't contribute to understanding
   
   **How to distinguish:**
   
   📚 History:
   ✅ GOOD: "Why did the French Revolution begin?" (conceptual - causes)
   ✅ GOOD: "When did World War II end?" (important fact - major historical date)
   ❌ BAD: "What was the street address mentioned in the historical account?" (trivial detail)
   
   🧪 Science:
   ✅ GOOD: "Why does water boil at 100°C at sea level?" (conceptual - understanding)
   ✅ GOOD: "What is the chemical formula for water?" (essential fact - key terminology)
   ❌ BAD: "What was the temperature of the water in the example experiment?" (arbitrary detail from example)
   
   💼 Business:
   ✅ GOOD: "What advantages does this marketing strategy provide?" (conceptual - analysis)
   ✅ GOOD: "What does ROI stand for?" (important terminology)
   ❌ BAD: "What was the name of the startup used as an example?" (example-specific, not transferable)
   
   🎨 Art:
   ✅ GOOD: "How does impressionism differ from realism?" (conceptual - comparison)
   ✅ GOOD: "Who painted the Mona Lisa?" (essential fact - major work)
   ❌ BAD: "What was the painting used to illustrate color theory in this text?" (example detail)
   
   📖 Literature:
   ✅ GOOD: "What is the central theme of this work?" (conceptual - understanding)
   ✅ GOOD: "Who wrote 'War and Peace'?" (important fact - major author)
   ❌ BAD: "What page number was quoted in the text?" (trivial detail)

3. The Key Distinction:
   
   ASK YOURSELF: "Is this information..."
   
   ✅ CORE to the topic? → Include it
      - "When did WWII end?" - This IS the topic
      - "What is photosynthesis?" - This IS what we're learning
   
   ✅ HELPS understand the concept? → Include it
      - "Why did the war start?" - Explains causation
      - "How does X differ from Y?" - Builds understanding
   
   ❌ Just an EXAMPLE detail? → Skip it
      - "What company was mentioned as an example?"
      - "What was the character's name in the illustration?"
      - These are scaffolding, not the learning objective

4. Balance Guidelines:
   - Aim for 60-70% conceptual/understanding questions
   - Include 30-40% essential facts and terminology
   - 0% trivial or example-specific details

5. Each question must be answerable using ONLY the provided text:
   - No external knowledge required
   - No opinion-based or subjective questions
   - No trick questions or deliberately misleading options
   - Do not reference images, diagrams, or visual elements

6. Options Requirements:
   - Exactly 4 options per question
   - One clearly correct answer
   - Three plausible but incorrect distractors
   - All options should be similar in length and complexity
   - Distractors should represent common misunderstandings

7. Question Language:
   - Questions and answers MUST be in the same language as the source text

8. Coverage:
   - Cover different key concepts and essential facts from the source text
   - Focus on main ideas and important information, not minor details

Return ONLY valid JSON. No markdown, no explanations outside the JSON structure.`;

function userPrompt(topic: string, text: string) {
  return `Topic: ${topic}\nSource text:\n"""${text}"""\nRules: 4 options, exactly one correct, non-abstract, test understanding.`;
}
export async function ensureTopicQuestions(chapterId: string, topicId: string) {
  // ✅ Шаг 1: Быстрая проверка существующих вопросов
  let existingQuestions = await prisma.question.findMany({
    where: { topicId },
    orderBy: { createdAt: "asc" },
  });

  if (existingQuestions.length > 0) {
    console.log(
      `Found ${existingQuestions.length} existing questions for topic ${topicId}`
    );
    return existingQuestions;
  }

  // ✅ Шаг 2: Получаем данные топика
  const topic = await prisma.topic.findUnique({
    where: { id: topicId },
    select: {
      id: true,
      title: true,
      pageStart: true,
      pageEnd: true,
      chapterId: true,
      chapter: {
        select: {
          id: true,
          book: {
            select: {
              fileUrl: true,
            },
          },
        },
      },
    },
  });

  if (!topic) throw new Error("Topic not found");

  const from = topic.pageStart ?? 1;
  const to = topic.pageEnd ?? from;

  const filePath = topic.chapter.book.fileUrl;
  if (!filePath) throw new Error("Chapter.filePath is required");

  const raw = await extractPdfRangeText(filePath, from, to);
  const key = `quiz:${topicId}:${from}-${to}:${crypto
    .createHash("sha1")
    .update(raw)
    .digest("hex")}`;

  const cached = await prisma.genCache.findUnique({ where: { key } });

  let questionsData: {
    stem: string;
    options: string[];
    correctIndex: number;
    explanation?: string;
  }[];

  if (cached) {
    const payload = JSON.parse(cached.payload) as {
      questions: typeof questionsData;
    };
    questionsData = payload.questions;
  } else {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: prompt },
        { role: "user", content: userPrompt(topic.title, raw) },
      ],
      response_format: { type: "json_object" },
      temperature: 0.4,
      frequency_penalty: 0.5,
      presence_penalty: 0.3,
      max_tokens: 16000,
    });

    const content = completion.choices[0].message.content ?? "{}";
    let json: { questions: typeof questionsData };

    try {
      json = JSON.parse(content) as { questions: typeof questionsData };
    } catch {
      json = { questions: [] };
    }

    if (
      !json.questions ||
      !Array.isArray(json.questions) ||
      json.questions.length === 0
    ) {
      json = {
        questions: [
          {
            stem: `What is the main idea of: ${topic.title}?`,
            options: ["A", "B", "C", "D"],
            correctIndex: 0,
            explanation: "From the provided text",
          },
        ],
      };
    }

    questionsData = json.questions;

    await prisma.genCache.upsert({
      where: { key },
      create: {
        key,
        payload: JSON.stringify(json),
        tokens: completion.usage?.total_tokens ?? 0,
      },
      update: {},
    });
  }

  try {
    const created = await prisma.$transaction(
      questionsData.map((q) =>
        prisma.question.create({
          data: {
            chapterId,
            topicId,
            stem: q.stem,
            options: q.options,
            correctIndex: Math.max(0, Math.min(3, Number(q.correctIndex ?? 0))),
            explanation: q.explanation ?? null,
            provenance: { source: "openai", model: "gpt-4o-mini" },
            modelSnapshot: "gpt-4o-mini",
          },
        })
      )
    );

    console.log(`Created ${created.length} questions for topic ${topicId}`);
    return created;
  } catch (error: any) {
    if (error.code === "P2002") {
      console.log(
        `Conflict detected, returning existing questions for topic ${topicId}`
      );
      existingQuestions = await prisma.question.findMany({
        where: { topicId },
        orderBy: { createdAt: "asc" },
      });

      if (existingQuestions.length > 0) {
        return existingQuestions;
      }
    }

    // Если это другая ошибка или вопросов все еще нет, пробрасываем ошибку
    throw error;
  }
}
