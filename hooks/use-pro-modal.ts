import { create } from 'zustand';

interface ProModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpen: () => void;
}

export const useProModal = create<ProModalProps>((set) => ({
  isOpen: false,
  onClose: () => set({ isOpen: false }),
  onOpen: () => set({ isOpen: true }),
}));
