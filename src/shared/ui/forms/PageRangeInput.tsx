"use client";

import { useFormContext } from "react-hook-form";
import { Input } from "@/shared/ui/components/input";
import { Label } from "@/shared/ui/components/label";

interface PageRangeInputProps {
  startName?: string;
  endName?: string;
  startLabel?: string;
  endLabel?: string;
}

export function PageRangeInput({
  startName = "pageStart",
  endName = "pageEnd",
  startLabel = "Page start",
  endLabel = "Page end",
}: PageRangeInputProps) {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  const startError = errors[startName];
  const endError = errors[endName];

  return (
    <div className="grid grid-cols-2 gap-3">
      <div className="space-y-1">
        <Label htmlFor={startName}>{startLabel}</Label>
        <Input
          id={startName}
          type="number"
          {...register(startName, {
            setValueAs: (v) => (v === "" ? undefined : Number(v)),
          })}
          aria-invalid={!!startError}
        />
        {startError && (
          <p className="text-sm text-red-600">
            {String(startError.message || "")}
          </p>
        )}
      </div>

      <div className="space-y-1">
        <Label htmlFor={endName}>{endLabel}</Label>
        <Input
          id={endName}
          type="number"
          {...register(endName, {
            setValueAs: (v) => (v === "" ? undefined : Number(v)),
          })}
          aria-invalid={!!endError}
        />
        {endError && (
          <p className="text-sm text-red-600">
            {String(endError.message || "")}
          </p>
        )}
      </div>
    </div>
  );
}
