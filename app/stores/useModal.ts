import create from "zustand";

interface Props {
  isOpen: boolean;
  open: () => void;
  close: () => void;
}

export const useModal = create<Props>((set) => ({
  isOpen: false,
  open: () => set(() => ({ isOpen: true })),
  close: () => set(() => ({ isOpen: false })),
}));
