"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

export type Question = {
  id: string;
  stem: string;
  options: string[]; // 4 options
  correctIndex: number; // single-correct to match your DB
  explanation?: string | null;
};

type QuizPayload = { questions: Question[] };

export default function QuizRunner({
  bookId,
  chapterId,
  topicId,
}: {
  bookId: string;
  chapterId: string;
  topicId: string;
}) {
  const [quiz, setQuiz] = useState<QuizPayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [idx, setIdx] = useState(0);
  const [choice, setChoice] = useState<string>("");
  const [checked, setChecked] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);

  async function load() {
    setLoading(true);
    const res = await fetch(
      `/api/books/${bookId}/chapters/${chapterId}/topics/${topicId}/quiz`,
      { cache: "no-store" }
    );
    const data = await res.json();
    setQuiz(data);
    setLoading(false);
    setIdx(0);
    setChoice("");
    setChecked(false);
    setScore(0);
  }

  useEffect(() => {
    load();
  }, [chapterId, topicId]);

  if (loading) return <div className="p-6">Loading…</div>;
  if (!quiz || quiz.questions.length === 0)
    return <div className="p-6">No questions.</div>;

  const q = quiz.questions[idx];
  const isCorrect = checked && parseInt(choice, 10) === q.correctIndex;

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>
            Question {idx + 1} / {quiz.questions.length}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-base">{q.stem}</div>
          <RadioGroup
            value={choice}
            onValueChange={(v) => {
              if (!checked) setChoice(v);
            }}
          >
            {q.options.map((opt, i) => (
              <div
                key={i}
                className={`flex items-center gap-2 rounded-lg border p-3 ${
                  checked && i === q.correctIndex
                    ? "border-green-500"
                    : checked && i === parseInt(choice, 10)
                    ? "border-red-500"
                    : "border-muted"
                }`}
              >
                <RadioGroupItem
                  id={`opt-${i}`}
                  value={String(i)}
                  disabled={checked}
                />
                <Label htmlFor={`opt-${i}`}>{opt}</Label>
              </div>
            ))}
          </RadioGroup>
          <div className="flex gap-2">
            {!checked ? (
              <Button
                onClick={() => {
                  if (choice !== "") {
                    setChecked(true);
                    if (parseInt(choice, 10) === q.correctIndex)
                      setScore((s) => s + 1);
                  }
                }}
              >
                Check
              </Button>
            ) : (
              <>
                <Button
                  variant="secondary"
                  onClick={() => {
                    setChecked(false);
                    setChoice("");
                    if (idx < quiz.questions.length - 1) setIdx((i) => i + 1);
                  }}
                >
                  Next
                </Button>
                <Button variant="outline" onClick={load}>
                  Restart
                </Button>
              </>
            )}
          </div>
          {checked && (
            <div
              className={`text-sm ${
                isCorrect ? "text-green-600" : "text-red-600"
              }`}
            >
              {isCorrect
                ? "Correct"
                : `Incorrect. Correct: ${q.options[q.correctIndex]}`}
              {q.explanation ? (
                <div className="mt-2 text-muted-foreground">
                  {q.explanation}
                </div>
              ) : null}
            </div>
          )}
        </CardContent>
      </Card>

      {idx === quiz.questions.length - 1 && checked && (
        <div className="text-sm text-muted-foreground">
          Score: {score} / {quiz.questions.length}
        </div>
      )}
    </div>
  );
}
