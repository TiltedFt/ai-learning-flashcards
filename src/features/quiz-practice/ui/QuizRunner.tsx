"use client";

import { useEffect } from "react";
import { Button } from "@/shared/ui/components/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/ui/components/card";
import {
  RadioGroup,
  RadioGroupItem,
} from "@/shared/ui/components/radio-group";
import { Label } from "@/shared/ui/components/label";
import { useQuizStore } from "@/shared/stores";

export type Question = {
  id: string;
  stem: string;
  options: string[];
  correctIndex: number;
  explanation?: string | null;
};

export default function QuizRunner({ topicId }: { topicId: string }) {
  const {
    isLoading,
    selectedOption,
    isChecked,
    score,
    loadQuiz,
    selectOption,
    checkAnswer,
    nextQuestion,
    resetQuiz,
    getCurrentQuestion,
    getProgress,
    isLastQuestion,
  } = useQuizStore();

  useEffect(() => {
    loadQuiz(topicId);
  }, [topicId, loadQuiz]);

  if (isLoading) return <div className="p-6">Loading…</div>;

  const question = getCurrentQuestion();
  if (!question) return <div className="p-6">No questions.</div>;

  const progress = getProgress();
  const isLast = isLastQuestion();
  const selectedIndex = parseInt(selectedOption, 10);
  const isCorrect = isChecked && selectedIndex === question.correctIndex;

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>
            Question {progress.current} / {progress.total}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-base">{question.stem}</div>
          <RadioGroup
            value={selectedOption}
            onValueChange={(v) => selectOption(parseInt(v, 10))}
          >
            {question.options.map((opt, i) => (
              <div
                key={i}
                className={`flex items-center gap-2 rounded-lg border p-3 ${
                  isChecked && i === question.correctIndex
                    ? "border-green-500"
                    : isChecked && i === selectedIndex
                    ? "border-red-500"
                    : "border-muted"
                }`}
              >
                <RadioGroupItem
                  id={`opt-${i}`}
                  value={String(i)}
                  disabled={isChecked}
                />
                <Label htmlFor={`opt-${i}`}>{opt}</Label>
              </div>
            ))}
          </RadioGroup>
          <div className="flex gap-2">
            {!isChecked ? (
              <Button onClick={checkAnswer} disabled={selectedOption === ""}>
                Check
              </Button>
            ) : (
              <>
                {!isLast && (
                  <Button variant="secondary" onClick={nextQuestion}>
                    Next
                  </Button>
                )}
                <Button variant="outline" onClick={resetQuiz}>
                  Restart
                </Button>
              </>
            )}
          </div>
          {isChecked && (
            <div
              className={`text-sm ${
                isCorrect ? "text-green-600" : "text-red-600"
              }`}
            >
              {isCorrect
                ? "Correct"
                : `Incorrect. Correct: ${question.options[question.correctIndex]}`}
              {question.explanation && (
                <div className="mt-2 text-muted-foreground">
                  {question.explanation}
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {isLast && isChecked && (
        <div className="text-sm text-muted-foreground">
          Score: {score} / {progress.total}
        </div>
      )}
    </div>
  );
}
