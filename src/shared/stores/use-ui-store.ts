import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { useEffect, useState } from "react";

// Dialog types
type DialogState = {
  createBook: boolean;
  addChapter: boolean;
  addTopic: boolean;
};

type DialogContext = {
  bookId?: string;
  chapterId?: string;
  bookTitle?: string;
};

type UIState = {
  dialogs: DialogState;
  dialogContext: DialogContext;
  globalLoading: boolean;
  loadingMessage: string | null;
  notifications: Array<{
    id: string;
    type: "success" | "error" | "info" | "warning";
    message: string;
    timestamp: number;
  }>;
};

type UIActions = {
  openDialog: (dialog: keyof DialogState, context?: DialogContext) => void;
  closeDialog: (dialog: keyof DialogState) => void;
  closeAllDialogs: () => void;
  getDialogContext: () => DialogContext;
  setGlobalLoading: (loading: boolean, message?: string) => void;
  addNotification: (
    type: UIState["notifications"][0]["type"],
    message: string
  ) => string;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
};

const initialDialogs: DialogState = {
  createBook: false,
  addChapter: false,
  addTopic: false,
};

export const useUIStore = create<UIState & UIActions>()(
  devtools(
    immer((set, get) => ({
      dialogs: initialDialogs,
      dialogContext: {},
      globalLoading: false,
      loadingMessage: null,
      notifications: [],

      openDialog: (dialog, context = {}) => {
        set((state) => {
          state.dialogs[dialog] = true;
          state.dialogContext = { ...state.dialogContext, ...context };
        });
      },

      closeDialog: (dialog) => {
        set((state) => {
          state.dialogs[dialog] = false;
        });
      },

      closeAllDialogs: () => {
        set((state) => {
          state.dialogs = { ...initialDialogs };
          state.dialogContext = {};
        });
      },

      getDialogContext: () => get().dialogContext,

      setGlobalLoading: (loading, message) => {
        set((state) => {
          state.globalLoading = loading;
          state.loadingMessage = message || null;
        });
      },

      addNotification: (type, message) => {
        const id = `${Date.now()}-${Math.random()}`;
        set((state) => {
          state.notifications.push({
            id,
            type,
            message,
            timestamp: Date.now(),
          });
        });

        setTimeout(() => {
          get().removeNotification(id);
        }, 5000);

        return id;
      },

      removeNotification: (id) => {
        set((state) => {
          state.notifications = state.notifications.filter((n) => n.id !== id);
        });
      },

      clearNotifications: () => {
        set((state) => {
          state.notifications = [];
        });
      },
    })),
    { name: "UIStore" }
  )
);

export const useDialog = (dialog: keyof DialogState) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isOpen = useUIStore((state) => state.dialogs[dialog]);
  const context = useUIStore((state) => state.dialogContext);
  const openDialog = useUIStore((state) => state.openDialog);
  const closeDialog = useUIStore((state) => state.closeDialog);

  // Return stable object after mount
  if (!mounted) {
    return {
      isOpen: false,
      context: {},
      open: () => {},
      close: () => {},
    };
  }

  return {
    isOpen,
    context,
    open: () => openDialog(dialog),
    close: () => closeDialog(dialog),
  };
};

export const useGlobalLoading = () => {
  const isLoading = useUIStore((state) => state.globalLoading);
  const message = useUIStore((state) => state.loadingMessage);

  return { isLoading, message };
};

export const useNotifications = () =>
  useUIStore((state) => state.notifications);

export const useUIActions = () => {
  const openDialog = useUIStore((state) => state.openDialog);
  const closeDialog = useUIStore((state) => state.closeDialog);
  const closeAllDialogs = useUIStore((state) => state.closeAllDialogs);
  const setGlobalLoading = useUIStore((state) => state.setGlobalLoading);
  const addNotification = useUIStore((state) => state.addNotification);
  const removeNotification = useUIStore((state) => state.removeNotification);
  const clearNotifications = useUIStore((state) => state.clearNotifications);

  return {
    openDialog,
    closeDialog,
    closeAllDialogs,
    setGlobalLoading,
    addNotification,
    removeNotification,
    clearNotifications,
  };
};
