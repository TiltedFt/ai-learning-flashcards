import { enableMapSet } from "immer";
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

enableMapSet();

// Types
export type Book = {
  id: string;
  title: string;
  author?: string;
  progress?: number;
};

export type Chapter = {
  id: string;
  order: number;
  title: string;
  pageStart: number;
  pageEnd: number;
  bookId: string;
};

export type Topic = {
  id: string;
  title: string;
  pageStart: number;
  pageEnd: number;
  order: number;
  chapterId: string;
};
    
type CacheEntry<T> = {
  data: T;
  timestamp: number;
  isLoading: boolean;
  error: string | null;
};

type BooksState = {
  books: Map<string, CacheEntry<Book>>;
  booksList: CacheEntry<Book[]> | null;
  chapters: Map<string, CacheEntry<Chapter[]>>;
  topics: Map<string, CacheEntry<Topic[]>>;
};

type BooksActions = {
  fetchBooks: () => Promise<void>;
  fetchBook: (id: string) => Promise<void>;
  invalidateBooks: () => void;
  fetchChapters: (bookId: string) => Promise<void>;
  invalidateChapters: (bookId: string) => void;
  fetchTopics: (bookId: string, chapterId: string) => Promise<void>;
  invalidateTopics: (chapterId: string) => void;
  invalidateAll: () => void;
  getCacheAge: (key: string) => number | null;
};

const CACHE_TTL = 5 * 60 * 1000;

const createCacheEntry = <T>(data: T): CacheEntry<T> => ({
  data,
  timestamp: Date.now(),
  isLoading: false,
  error: null,
});

const createLoadingEntry = <T>(defaultData: T): CacheEntry<T> => ({
  data: defaultData,
  timestamp: Date.now(),
  isLoading: true,
  error: null,
});

const createErrorEntry = <T>(defaultData: T, error: string): CacheEntry<T> => ({
  data: defaultData,
  timestamp: Date.now(),
  isLoading: false,
  error,
});

export const useBooksStore = create<BooksState & BooksActions>()(
  devtools(
    immer((set, get) => ({
      books: new Map(),
      booksList: null,
      chapters: new Map(),
      topics: new Map(),

      fetchBooks: async () => {
        const cached = get().booksList;
        const age = cached ? Date.now() - cached.timestamp : Infinity;

        if (cached && age < CACHE_TTL && !cached.error) {
          return;
        }

        set((state) => {
          state.booksList = createLoadingEntry<Book[]>(cached?.data || []);
        });

        try {
          const res = await fetch("/api/books");
          if (!res.ok) throw new Error("Failed to fetch books");

          const data: Book[] = await res.json();

          set((state) => {
            state.booksList = createCacheEntry(data);
            data.forEach((book) => {
              state.books.set(book.id, createCacheEntry(book));
            });
          });
        } catch (error) {
          const message =
            error instanceof Error ? error.message : "Network error";
          set((state) => {
            state.booksList = createErrorEntry([], message);
          });
        }
      },

      fetchBook: async (id: string) => {
        const cached = get().books.get(id);
        const age = cached ? Date.now() - cached.timestamp : Infinity;

        if (cached && age < CACHE_TTL && !cached.error) {
          return;
        }

        set((state) => {
          state.books.set(
            id,
            createLoadingEntry<Book>(cached?.data || ({} as Book))
          );
        });

        try {
          const res = await fetch(`/api/books/${id}`);
          if (!res.ok) throw new Error("Failed to fetch book");

          const data: Book = await res.json();

          set((state) => {
            state.books.set(id, createCacheEntry(data));
          });
        } catch (error) {
          const message =
            error instanceof Error ? error.message : "Network error";
          set((state) => {
            state.books.set(id, createErrorEntry({} as Book, message));
          });
        }
      },

      fetchChapters: async (bookId: string) => {
        const cached = get().chapters.get(bookId);
        const age = cached ? Date.now() - cached.timestamp : Infinity;

        if (cached && age < CACHE_TTL && !cached.error) {
          return;
        }

        set((state) => {
          state.chapters.set(
            bookId,
            createLoadingEntry<Chapter[]>(cached?.data || [])
          );
        });

        try {
          const res = await fetch(`/api/chapters?bookId=${bookId}`);
          if (!res.ok) throw new Error("Failed to fetch chapters");

          const data: Chapter[] = await res.json();

          set((state) => {
            state.chapters.set(bookId, createCacheEntry(data));
          });
        } catch (error) {
          const message =
            error instanceof Error ? error.message : "Network error";
          set((state) => {
            state.chapters.set(bookId, createErrorEntry([], message));
          });
        }
      },

      fetchTopics: async (_bookId: string, chapterId: string) => {
        const cached = get().topics.get(chapterId);
        const age = cached ? Date.now() - cached.timestamp : Infinity;

        if (cached && age < CACHE_TTL && !cached.error) {
          return;
        }

        set((state) => {
          state.topics.set(
            chapterId,
            createLoadingEntry<Topic[]>(cached?.data || [])
          );
        });

        try {
          const res = await fetch(`/api/topics?chapterId=${chapterId}`);
          if (!res.ok) throw new Error("Failed to fetch topics");

          const data: Topic[] = await res.json();

          set((state) => {
            state.topics.set(chapterId, createCacheEntry(data));
          });
        } catch (error) {
          const message =
            error instanceof Error ? error.message : "Network error";
          set((state) => {
            state.topics.set(chapterId, createErrorEntry([], message));
          });
        }
      },

      invalidateBooks: () => {
        set((state) => {
          state.booksList = null;
          state.books.clear();
        });
      },

      invalidateChapters: (bookId: string) => {
        set((state) => {
          state.chapters.delete(bookId);
        });
      },

      invalidateTopics: (chapterId: string) => {
        set((state) => {
          state.topics.delete(chapterId);
        });
      },

      invalidateAll: () => {
        set((state) => {
          state.books.clear();
          state.booksList = null;
          state.chapters.clear();
          state.topics.clear();
        });
      },

      getCacheAge: (key: string) => {
        const parts = key.split(":");
        if (parts[0] === "books" && parts.length === 1) {
          const entry = get().booksList;
          return entry ? Date.now() - entry.timestamp : null;
        }
        return null;
      },
    })),
    { name: "BooksStore" }
  )
);

export const useBooks = () => {
  const data = useBooksStore((state) => state.booksList?.data || []);
  const isLoading = useBooksStore(
    (state) => state.booksList?.isLoading || false
  );
  const error = useBooksStore((state) => state.booksList?.error || null);

  return { data, isLoading, error };
};

export const useBook = (id: string) => {
  const entry = useBooksStore((state) => state.books.get(id));

  return {
    data: entry?.data || null,
    isLoading: entry?.isLoading || false,
    error: entry?.error || null,
  };
};

export const useChapters = (bookId: string) => {
  const entry = useBooksStore((state) => state.chapters.get(bookId));

  return {
    data: entry?.data || [],
    isLoading: entry?.isLoading || false,
    error: entry?.error || null,
  };
};

export const useTopics = (chapterId: string) => {
  const entry = useBooksStore((state) => state.topics.get(chapterId));

  return {
    data: entry?.data || [],
    isLoading: entry?.isLoading || false,
    error: entry?.error || null,
  };
};

export const useBooksActions = () => {
  const fetchBooks = useBooksStore((state) => state.fetchBooks);
  const fetchBook = useBooksStore((state) => state.fetchBook);
  const fetchChapters = useBooksStore((state) => state.fetchChapters);
  const fetchTopics = useBooksStore((state) => state.fetchTopics);
  const invalidateBooks = useBooksStore((state) => state.invalidateBooks);
  const invalidateChapters = useBooksStore((state) => state.invalidateChapters);
  const invalidateTopics = useBooksStore((state) => state.invalidateTopics);
  const invalidateAll = useBooksStore((state) => state.invalidateAll);

  return {
    fetchBooks,
    fetchBook,
    fetchChapters,
    fetchTopics,
    invalidateBooks,
    invalidateChapters,
    invalidateTopics,
    invalidateAll,
  };
};
