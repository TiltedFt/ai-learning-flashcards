import { ReactNode, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/ui/components/table";
import { DataTableLoading } from "./DataTableLoading";
import { DataTableEmpty } from "./DataTableEmpty";

export interface DataTableColumn<TData> {
  header: string;
  accessor: (item: TData) => ReactNode;
  className?: string;
}

export interface DataTableProps<TData> {
  data: TData[];
  columns: DataTableColumn<TData>[];
  isLoading?: boolean;
  emptyMessage?: string;
  getRowKey: (item: TData) => string;
  className?: string;
}

export function DataTable<TData>({
  data,
  columns,
  isLoading = false,
  emptyMessage = "No data available",
  getRowKey,
  className,
}: DataTableProps<TData>) {
  const colSpan = useMemo(() => columns.length, [columns.length]);

  const headerCells = useMemo(
    () =>
      columns.map((col, idx) => (
        <TableHead key={idx} className={col.className}>
          {col.header}
        </TableHead>
      )),
    [columns]
  );

  const bodyRows = useMemo(() => {
    if (isLoading) {
      return <DataTableLoading colSpan={colSpan} />;
    }

    if (data.length === 0) {
      return <DataTableEmpty colSpan={colSpan} message={emptyMessage} />;
    }

    return data.map((item) => (
      <TableRow key={getRowKey(item)}>
        {columns.map((col, idx) => (
          <TableCell key={idx} className={col.className}>
            {col.accessor(item)}
          </TableCell>
        ))}
      </TableRow>
    ));
  }, [isLoading, data, columns, colSpan, emptyMessage, getRowKey]);

  return (
    <div className="rounded-2xl border">
      <Table className={className}>
        <TableHeader>
          <TableRow>{headerCells}</TableRow>
        </TableHeader>
        <TableBody>{bodyRows}</TableBody>
      </Table>
    </div>
  );
}
