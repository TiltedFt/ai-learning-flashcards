import Link from "next/link";
import { Button } from "@/shared/ui/components/button";

export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
}

interface DataTablePaginationProps {
  pagination: PaginationInfo;
  baseUrl: string;
}

export function DataTablePagination({
  pagination,
  baseUrl,
}: DataTablePaginationProps) {
  const { currentPage, totalPages, totalItems, pageSize } = pagination;

  const buildUrl = (page: number) => {
    return `${baseUrl}?page=${page}&pageSize=${pageSize}`;
  };

  return (
    <div className="mt-6 flex items-center justify-between">
      <span className="text-sm text-muted-foreground">
        Page {currentPage} of {totalPages} • {totalItems} total
      </span>
      <div className="flex gap-2">
        {currentPage > 1 ? (
          <Button asChild variant="outline">
            <Link href={buildUrl(currentPage - 1)}>Prev</Link>
          </Button>
        ) : (
          <Button variant="outline" disabled>
            Prev
          </Button>
        )}

        {currentPage < totalPages ? (
          <Button asChild variant="outline">
            <Link href={buildUrl(currentPage + 1)}>Next</Link>
          </Button>
        ) : (
          <Button variant="outline" disabled>
            Next
          </Button>
        )}
      </div>
    </div>
  );
}
