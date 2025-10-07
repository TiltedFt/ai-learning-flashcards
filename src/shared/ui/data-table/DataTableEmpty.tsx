import { TableRow, TableCell } from "@/shared/ui/components/table";

interface DataTableEmptyProps {
  colSpan: number;
  message?: string;
}

export function DataTableEmpty({
  colSpan,
  message = "No data available",
}: DataTableEmptyProps) {
  return (
    <TableRow>
      <TableCell colSpan={colSpan} className="h-24 text-center">
        <p className="text-sm text-muted-foreground">{message}</p>
      </TableCell>
    </TableRow>
  );
}
