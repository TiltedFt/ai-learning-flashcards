import { TableRow, TableCell } from "@/shared/ui/components/table";
import { Loader2 } from "lucide-react";

interface DataTableLoadingProps {
  colSpan: number;
  message?: string;
}

export function DataTableLoading({
  colSpan,
  message = "Loading...",
}: DataTableLoadingProps) {
  return (
    <TableRow>
      <TableCell colSpan={colSpan} className="h-24 text-center">
        <div className="flex items-center justify-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin" />
          <p className="text-sm text-muted-foreground">{message}</p>
        </div>
      </TableCell>
    </TableRow>
  );
}
