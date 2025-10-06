"use client";
import {
  useFormContext,
  useController,
  type FieldValues,
  type Path,
} from "react-hook-form";
import { Input } from "@/shared/ui/components/input";
import { FieldLabel } from "@/shared/ui/components/field";

export function TxtInput<T extends FieldValues>({
  name,
  label,
  type = "text",
  placeholder,
}: {
  name: Path<T>;
  label: string;
  type?: string;
  placeholder?: string;
}) {
  const { control } = useFormContext<T>();
  const { field, fieldState } = useController({ control, name });
  const id = String(name);
  const msg = fieldState.error?.message as string | undefined;

  return (
    <div className="grid gap-1">
      <FieldLabel htmlFor={id}>{label}</FieldLabel>

      <Input
        id={id}
        type={type}
        placeholder={placeholder}
        {...field}
        aria-invalid={fieldState.invalid}
        aria-describedby={`${id}-error`}
        className={
          fieldState.invalid
            ? "border-red-500 focus-visible:ring-red-500"
            : undefined
        }
      />

      <p
        id={`${id}-error`}
        role="alert"
        className={`text-xs text-red-500 min-h-4 ${msg ? "" : "opacity-0"}`}
      >
        {msg || " "}
      </p>
    </div>
  );
}
