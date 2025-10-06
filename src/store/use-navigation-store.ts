import { create } from "zustand";
import { persist } from "zustand/middleware";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface NavigationContext {
  // Book context
  bookId: string | null;
  bookTitle: string | null;

  // Chapter context
  chapterId: string | null;
  chapterTitle: string | null;

  // Topic context
  topicId: string | null;
  topicTitle: string | null;

  // Derived breadcrumbs
  breadcrumbs: BreadcrumbItem[];
}

interface NavigationStore extends NavigationContext {
  // Actions
  setBookContext: (id: string, title: string) => void;
  setChapterContext: (id: string, title: string) => void;
  setTopicContext: (id: string, title: string) => void;
  clearContext: () => void;
  clearFromChapter: () => void;
  clearFromTopic: () => void;
}

const initialState: NavigationContext = {
  bookId: null,
  bookTitle: null,
  chapterId: null,
  chapterTitle: null,
  topicId: null,
  topicTitle: null,
  breadcrumbs: [],
};

export const useNavigationStore = create<NavigationStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      setBookContext: (id, title) => {
        set({
          bookId: id,
          bookTitle: title,
          chapterId: null,
          chapterTitle: null,
          topicId: null,
          topicTitle: null,
          breadcrumbs: [
            { label: "Books", href: "/books" },
            { label: title, href: `/books/${id}` },
          ],
        });
      },

      setChapterContext: (id, title) => {
        const { bookId, bookTitle } = get();
        set({
          chapterId: id,
          chapterTitle: title,
          topicId: null,
          topicTitle: null,
          breadcrumbs: [
            { label: "Books", href: "/books" },
            { label: bookTitle || "Book", href: `/books/${bookId}` },
            { label: title, href: `/books/${bookId}/${id}` },
          ],
        });
      },

      setTopicContext: (id, title) => {
        const { bookId, bookTitle, chapterId, chapterTitle } = get();
        set({
          topicId: id,
          topicTitle: title,
          breadcrumbs: [
            { label: "Books", href: "/books" },
            { label: bookTitle || "Book", href: `/books/${bookId}` },
            {
              label: chapterTitle || "Chapter",
              href: `/books/${bookId}/${chapterId}`,
            },
            { label: title },
          ],
        });
      },

      clearContext: () => set(initialState),

      clearFromChapter: () =>
        set({
          chapterId: null,
          chapterTitle: null,
          topicId: null,
          topicTitle: null,
        }),

      clearFromTopic: () =>
        set({
          topicId: null,
          topicTitle: null,
        }),
    }),
    {
      name: "navigation-context",
      // Сохраняем в sessionStorage для сохранения при обновлении
      // но очистки при закрытии вкладки
      partialize: (state) => ({
        bookId: state.bookId,
        bookTitle: state.bookTitle,
        chapterId: state.chapterId,
        chapterTitle: state.chapterTitle,
        topicId: state.topicId,
        topicTitle: state.topicTitle,
      }),
    }
  )
);

// Селекторы для удобства
export const useBookContext = () =>
  useNavigationStore((s) => ({
    bookId: s.bookId,
    bookTitle: s.bookTitle,
  }));

export const useChapterContext = () =>
  useNavigationStore((s) => ({
    chapterId: s.chapterId,
    chapterTitle: s.chapterTitle,
  }));

export const useBreadcrumbs = () => useNavigationStore((s) => s.breadcrumbs);
