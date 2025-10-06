import { create } from "zustand";

type Breadcrumb = {
  label: string;
  href?: string;
};

interface BreadcrumbNavigationStore {
  crumbs: Breadcrumb[];
  setCrumbs: (c: Breadcrumb[]) => void;
}

export const useNavigation = create<BreadcrumbNavigationStore>((set) => ({
  crumbs: [],
  setCrumbs: (c) => set({ crumbs: c }),
}));
