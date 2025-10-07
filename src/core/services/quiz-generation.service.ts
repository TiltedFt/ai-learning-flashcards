import OpenAI from "openai";
import crypto from "node:crypto";
import { prisma } from "@/shared/lib/db";
import { extractPdfRangeText } from "@/core/services/pdf.service";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const SYSTEM = `Return ONLY JSON with {"questions": [{"stem": string, "options": [string,string,string,string], "correctIndex": number, "explanation": string?}]}. No prose.`;
const prompt = `
Your role: quiz generator.

You receive: a **topic title** and **source text**.  
You must output a JSON object with a field questions — array of question.  

Rules:

- Each question object must include:
  - id: unique identifier (string)  
  - stem: the question text / prompt  
  - options: exactly 4 options, each with "{ id, text }"
  - correctOptionIds: array of IDs (one or more)  
  - bloomLevel: one of "remember", "understand", "apply", "analyze"
  - type: the Bloom’s taxonomy type same as bloomLevel  
  - explanation: optional explanation string  
  - Question types must vary. Include at least one of each type (if possible): remember, understand, apply, analyze  
  - Questions should test understanding, not be purely factual recall  
  - Questions should stay on topic. If two topics are present, focus on the larger one 
  - Questions should be ONLY related to the topic and text you recieve 
  - Do not generate abstract questions  
  - The output must be valid JSON, exactly this structure, no extra prose outside JSON

Return ONLY JSON with {"questions": [{"stem": string, "options": [string,string,string,string], "correctIndex": number, "explanation": string?}]}. No prose.
`;
function userPrompt(topic: string, text: string) {
  return `Topic: ${topic}\nSource text:\n"""${text}"""\nRules: 4 options, exactly one correct, non-abstract, test understanding.`;
}

export async function ensureTopicQuestions(chapterId: string, topicId: string) {
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

  // GenCache
  const key = `quiz:${topicId}:${from}-${to}:${crypto
    .createHash("sha1")
    .update(raw)
    .digest("hex")}`;
  const cached = await prisma.genCache.findUnique({ where: { key } });
  if (cached) {
    const payload = JSON.parse(cached.payload) as {
      questions: {
        stem: string;
        options: string[];
        correctIndex: number;
        explanation?: string;
      }[];
    };
    return writeQuestions(chapterId, topicId, payload.questions);
  }

  const completion = await openai.chat.completions.create({
    model: "gpt-4.1-mini",
    messages: [
      { role: "system", content: SYSTEM },
      { role: "user", content: userPrompt(topic.title, raw) },
    ],
    response_format: { type: "json_object" },
    temperature: 0.2,
    max_tokens: 1200,
  });

  const content = completion.choices[0].message.content ?? "{}";
  let json: any;
  try {
    json = JSON.parse(content);
  } catch {
    json = { questions: [] };
  }
  if (
    !json.questions ||
    !Array.isArray(json.questions) ||
    json.questions.length === 0
  ) {
    // fallback single question
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

  await prisma.genCache.create({
    data: {
      key,
      payload: JSON.stringify(json),
      tokens: completion.usage?.total_tokens ?? 0,
    },
  });
  return writeQuestions(chapterId, topicId, json.questions);
}

async function writeQuestions(
  chapterId: string,
  topicId: string,
  qs: {
    stem: string;
    options: string[];
    correctIndex: number;
    explanation?: string;
  }[]
) {
  const created = await prisma.$transaction(
    qs.map((q) =>
      prisma.question.create({
        data: {
          chapterId,
          topicId,
          stem: q.stem,
          options: q.options,
          correctIndex: Math.max(0, Math.min(3, Number(q.correctIndex ?? 0))),
          explanation: q.explanation ?? null,
          provenance: { source: "openai", model: "gpt-4.1-mini" } as any,
          modelSnapshot: "gpt-4.1-mini",
        },
      })
    )
  );
  return created;
}
