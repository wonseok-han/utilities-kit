import { create } from 'zustand';

interface DeviceState {
  isMobile: boolean | undefined;
  hasHydrated: boolean;
  setIsMobile: (value: boolean) => void;
  setHasHydrated: (value: boolean) => void;
}

export const useDeviceStore = create<DeviceState>((set) => ({
  isMobile: undefined,
  hasHydrated: false,
  setIsMobile: (value) => set({ isMobile: value }),
  setHasHydrated: (value) => set({ hasHydrated: value }),
}));
