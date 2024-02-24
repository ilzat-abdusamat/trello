'use client';

import { Dialog, DialogContent } from '@/components/ui/dialog';
import { useCardModal } from '@/hooks/use-card-modal';

export const CardModal = () => {
  const { id, isOpen, onClose } = useCardModal((modalState) => modalState);

  return (
    <Dialog
      open={isOpen}
      onOpenChange={onClose}
    >
      <DialogContent>{id}</DialogContent>
    </Dialog>
  );
};
