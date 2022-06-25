import create from "zustand";

export const useModal = create((set) => ({
  isOpen: false,
  open: () => set(() => ({ isOpen: true })),
  close: () => set(() => ({ isOpen: false })),
}));
