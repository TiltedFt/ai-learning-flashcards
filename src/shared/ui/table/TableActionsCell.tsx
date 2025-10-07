"use client";

import Link from "next/link";
import { Button } from "@/shared/ui/components/button";
import type { TableAction } from "@/shared/types";

interface TableActionsCellProps<TItem = unknown> {
  item: TItem;
  actions: TableAction<TItem>[];
}

export function TableActionsCell<TItem = unknown>({
  item,
  actions,
}: TableActionsCellProps<TItem>) {
  return (
    <div className="flex gap-2">
      {actions.map((action, index) => {
        if (action.href) {
          return (
            <Button
              key={index}
              asChild
              size="sm"
              variant={action.variant || "outline"}
              disabled={action.disabled}
            >
              <Link href={action.href}>{action.label}</Link>
            </Button>
          );
        }

        return (
          <Button
            key={index}
            size="sm"
            variant={action.variant || "outline"}
            onClick={() => action.onClick(item)}
            disabled={action.disabled}
          >
            {action.label}
          </Button>
        );
      })}
    </div>
  );
}
