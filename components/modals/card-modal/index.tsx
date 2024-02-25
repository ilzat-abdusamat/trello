'use client';

import { useQuery } from '@tanstack/react-query';

import { Dialog, DialogContent } from '@/components/ui/dialog';
import { useCardModal } from '@/hooks/use-card-modal';
import { CardWithList } from '@/types';
import { fetcher } from '@/lib/fetcher';
import { Header } from './header';

export const CardModal = () => {
  const { id, isOpen, onClose } = useCardModal((modalState) => modalState);

  const { data: cardData } = useQuery<CardWithList>({
    queryKey: ['card', id],
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return fetcher(`/api/cards/${id}`);
    },
  });

  return (
    <Dialog
      open={isOpen}
      onOpenChange={onClose}
    >
      <DialogContent>{!cardData ? <Header.Skeleton /> : <Header data={cardData} />}</DialogContent>
    </Dialog>
  );
};
