import { ReactNode } from "react";

export interface FormDialogProps<TFormValues = Record<string, unknown>> {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  children: ReactNode;
  onSubmit: (values: TFormValues) => void | Promise<void>;
  isSubmitting?: boolean;
  submitLabel?: string;
  cancelLabel?: string;
}

export interface PageRangeInputValue {
  pageStart: number;
  pageEnd: number;
}
