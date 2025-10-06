import OpenAI from "openai";
import crypto from "node:crypto";
import { prisma } from "./db";
import { extractPdfRangeText } from "@/services/pdf.service";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const SYSTEM = `Return ONLY JSON with {"questions": [{"stem": string, "options": [string,string,string,string], "correctIndex": number, "explanation": string?}]}. No prose.`;

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
            // ← добавьте связь с Book
            select: {
              fileUrl: true, // ← получите fileUrl из Book
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
