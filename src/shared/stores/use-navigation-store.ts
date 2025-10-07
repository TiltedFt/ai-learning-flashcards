import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

/**
 * Navigation context for breadcrumbs and cross-feature navigation
 * Provides hierarchical context (book > chapter > topic) without URL pollution
 */

export type NavigationContext = {
  book: { id: string; title: string } | null;
  chapter: { id: string; title: string; bookId: string } | null;
  topic: { id: string; title: string; chapterId: string } | null;
};

type NavigationState = {
  context: NavigationContext;
  history: NavigationContext[];
};

type NavigationActions = {
  setBook: (book: { id: string; title: string } | null) => void;
  setChapter: (chapter: {
    id: string;
    title: string;
    bookId: string;
  } | null) => void;
  setTopic: (topic: {
    id: string;
    title: string;
    chapterId: string;
  } | null) => void;
  setFullContext: (context: Partial<NavigationContext>) => void;
  clearContext: () => void;
  pushContext: () => void;
  popContext: () => void;
};

const initialState: NavigationState = {
  context: {
    book: null,
    chapter: null,
    topic: null,
  },
  history: [],
};

export const useNavigationStore = create<NavigationState & NavigationActions>()(
  devtools(
    immer((set, get) => ({
      ...initialState,

      setBook: (book) => {
        set((state) => {
          state.context.book = book;
          // Clear child context when parent changes
          if (!book) {
            state.context.chapter = null;
            state.context.topic = null;
          }
        });
      },

      setChapter: (chapter) => {
        set((state) => {
          state.context.chapter = chapter;
          // Clear child context when parent changes
          if (!chapter) {
            state.context.topic = null;
          }
        });
      },

      setTopic: (topic) => {
        set((state) => {
          state.context.topic = topic;
        });
      },

      setFullContext: (context) => {
        set((state) => {
          if (context.book !== undefined) {
            state.context.book = context.book;
          }
          if (context.chapter !== undefined) {
            state.context.chapter = context.chapter;
          }
          if (context.topic !== undefined) {
            state.context.topic = context.topic;
          }
        });
      },

      clearContext: () => {
        set((state) => {
          state.context = initialState.context;
          state.history = [];
        });
      },

      pushContext: () => {
        const current = get().context;
        set((state) => {
          state.history.push({ ...current });
        });
      },

      popContext: () => {
        set((state) => {
          const previous = state.history.pop();
          if (previous) {
            state.context = previous;
          }
        });
      },
    })),
    { name: "NavigationStore" }
  )
);

// Selectors
export const useNavigationContext = () =>
  useNavigationStore((state) => state.context);

export const useBookContext = () =>
  useNavigationStore((state) => state.context.book);

export const useChapterContext = () =>
  useNavigationStore((state) => state.context.chapter);

export const useTopicContext = () =>
  useNavigationStore((state) => state.context.topic);

export const useNavigationActions = () =>
  useNavigationStore((state) => ({
    setBook: state.setBook,
    setChapter: state.setChapter,
    setTopic: state.setTopic,
    setFullContext: state.setFullContext,
    clearContext: state.clearContext,
    pushContext: state.pushContext,
    popContext: state.popContext,
  }));

/**
 * Helper to build breadcrumb items from navigation context
 */
export const useBreadcrumbs = () => {
  const context = useNavigationContext();

  const items: Array<{ href?: string; label: string }> = [
    { href: "/books", label: "Books" },
  ];

  if (context.book) {
    items.push({
      href: `/books/${context.book.id}`,
      label: context.book.title,
    });
  }

  if (context.chapter) {
    items.push({
      label: context.chapter.title,
    });
  }

  if (context.topic) {
    items.push({
      label: context.topic.title,
    });
  }

  return items;
};
