import { create } from 'zustand';

interface ProModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpen: () => void;
}

export const useProModal = create<ProModalProps>((set) => ({
  isOpen: true,
  onClose: () => set({ isOpen: false }),
  onOpen: () => set({ isOpen: true }),
}));
