import { ReactNode } from "react";

export interface TableAction<TItem = unknown> {
  label: string;
  onClick: (item: TItem) => void;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  disabled?: boolean;
  href?: string;
}

export interface TableRowData {
  id: string;
  [key: string]: unknown;
}
