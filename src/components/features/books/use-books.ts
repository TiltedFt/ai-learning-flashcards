import useSWR from "swr";
import useSWRMutation from "swr/mutation";
import { apiClient } from "@/lib/api/client";
import { useNavigationStore } from "@/store/use-navigation-store";

interface Book {
  id: string;
  title: string;
  author?: string;
  progress?: number;
}

interface PaginatedBooks {
  items: Book[];
  page: number;
  pageSize: number;
  total: number;
  pages: number;
}

export function useBooks(page = 1, pageSize = 10) {
  const key = `/api/books?page=${page}&pageSize=${pageSize}`;

  const { data, error, isLoading, mutate } = useSWR<PaginatedBooks>(
    key,
    (url) => apiClient.get(url),
    {
      // Кешируем на 5 минут
      dedupingInterval: 300000,
      revalidateOnFocus: false,
    }
  );

  return {
    books: data?.items || [],
    pagination: data
      ? {
          page: data.page,
          pageSize: data.pageSize,
          total: data.total,
          pages: data.pages,
        }
      : null,
    isLoading,
    error,
    mutate,
  };
}

export function useCreateBook() {
  const { mutate: mutateBooks } = useSWR("/api/books");
  const setBookContext = useNavigationStore((s) => s.setBookContext);

  const { trigger, isMutating } = useSWRMutation(
    "/api/books",
    async (url, { arg }: { arg: FormData }) => {
      const response = await fetch(url, {
        method: "POST",
        body: arg,
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(
          error.details || error.error || "Failed to create book"
        );
      }

      return response.json();
    },
    {
      onSuccess: (data) => {
        // Инвалидируем кеш списка книг
        mutateBooks();
        // Сохраняем контекст для навигации
        setBookContext(data.id, data.title);
      },
    }
  );

  return {
    createBook: trigger,
    isCreating: isMutating,
  };
}
