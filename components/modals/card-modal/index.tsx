'use client';

import { useQuery } from '@tanstack/react-query';

import { Dialog, DialogContent } from '@/components/ui/dialog';
import { useCardModal } from '@/hooks/use-card-modal';
import { CardWithList } from '@/types';
import { fetcher } from '@/lib/fetcher';
import { Header } from './header';
import { Description } from './description';
import { Actions } from './actions';
import { AuditLog } from '@prisma/client';

export const CardModal = () => {
  const { id, isOpen, onClose } = useCardModal((modalState) => modalState);

  const { data: cardData } = useQuery<CardWithList>({
    queryKey: ['card', id],
    queryFn: async () => {
      return fetcher(`/api/cards/${id}`);
    },
  });

  const { data: auditLogsData } = useQuery<AuditLog[]>({
    queryKey: ['card-logs', id],
    queryFn: async () => {
      return fetcher(`/api/cards/${id}/logs`);
    },
  });

  console.log('auditLogsData', auditLogsData);

  return (
    <Dialog
      open={isOpen}
      onOpenChange={onClose}
    >
      <DialogContent>
        {!cardData ? <Header.Skeleton /> : <Header data={cardData} />}

        <div className='grid grid-cols-1 md:grid-cols-4 md:gap-4'>
          <div className='col-span-3'>
            <div className='w-full space-y-6'>
              {!cardData ? <Description.Skeleton /> : <Description data={cardData} />}
            </div>
          </div>
          {!cardData ? <Actions.Skeleton /> : <Actions data={cardData} />}
        </div>
        <h1>{}</h1>
      </DialogContent>
    </Dialog>
  );
};
