import OpenAI from "openai";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const systemPrompt = `
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

Example output structure:
json
{
  "questions": [
    {
      "id": "q1",
      "stem": "Which statement best describes ...?",
      "options": [
        { "id": "o1", "text": "… option A …" },
        { "id": "o2", "text": "… option B …" },
        { "id": "o3", "text": "… option C …" },
        { "id": "o4", "text": "… option D …" }
      ],
      "correctOptionIds": ["o2"],
      "bloomLevel": "understand",
      "type": "understand",
      "explanation": "… brief reasoning …"
    },
    {
      "id": "q2",
      "stem": "...",
      "options": [...],
      "correctOptionIds": [...],
      "bloomLevel": "apply",
      "type": "apply",
      "explanation": "…"
    }
  ]
}
`;

function makeUserPrompt(topic: string, text: string) {
  return `Topic: ${topic}\nSource text:\n"""${text}"""\nTask: …`;
}

async function generateQuizQuestion(topic: string, text: string) {
  const response = await client.responses.create({
    model: "gpt-4.1-mini",
    input: [
      { role: "system", content: systemPrompt },
      { role: "user", content: makeUserPrompt(topic, text) },
    ],
    temperature: 0.3,
  });

  return response.output_text;
}
