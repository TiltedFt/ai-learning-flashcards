"use client";

import { useController, useFormContext } from "react-hook-form";
import { Input } from "@/shared/ui/components/input";
import { FieldLabel } from "@/shared/ui/components/field";

interface FileInputProps {
  name: string;
  label: string;
  accept?: string;
  required?: boolean;
}

export function FileInput({ name, label, accept, required }: FileInputProps) {
  const { control } = useFormContext();
  const { field, fieldState } = useController({ control, name });
  const id = `file-${name}`;

  return (
    <div className="space-y-1">
      <FieldLabel htmlFor={id}>
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </FieldLabel>
      <Input
        id={id}
        type="file"
        accept={accept}
        onChange={(e) => {
          const file = e.target.files?.[0];
          field.onChange(file);
        }}
        aria-invalid={!!fieldState.error}
      />
      <p
        className={`text-xs text-red-500 min-h-4 ${
          fieldState.error ? "" : "opacity-0"
        }`}
      >
        {fieldState.error?.message || " "}
      </p>
    </div>
  );
}
