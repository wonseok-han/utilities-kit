import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SidebarState {
  isOpen: boolean;
  hasHydrated: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
}

export const useSidebarStore = create<SidebarState>()(
  persist(
    (set) => ({
      isOpen: false,
      hasHydrated: false,
      open: () => set({ isOpen: true }),
      close: () => set({ isOpen: false }),
      toggle: () => set((state) => ({ isOpen: !state.isOpen })),
    }),
    {
      name: 'sidebar-store', // localStorage 키 이름
      onRehydrateStorage: () => (state) => {
        // localStorage 복원이 완료되면 hasHydrated를 true로 설정
        if (state) {
          state.hasHydrated = true;
        }
      },
    }
  )
);
