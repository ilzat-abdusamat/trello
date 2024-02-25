'use client';

import { copyCard } from '@/actions/copy-card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useAction } from '@/hooks/use-action';
import { CardWithList } from '@/types';
import { CopyIcon, TrashIcon } from 'lucide-react';
import { useParams } from 'next/navigation';
import { toast } from 'sonner';

interface ActionsProps {
  data: CardWithList;
}

export const Actions = ({ data }: ActionsProps) => {
  const params = useParams();

  const { execute: executeCopyCard } = useAction(copyCard, {
    onSuccess: (data) => {
      toast.success('Card copied');
    },
  });

  const onCopy = () => {
    const boardId = params.boardId as string;
    console.log('boardId', boardId);
    executeCopyCard({
      id: data.id,
      boardId,
    });
  };

  return (
    <div className='space-y-2 mt-2'>
      <p className='text-xs font-semibold'>Actions</p>
      <Button
        onClick={onCopy}
        variant='gray'
        size='inline'
        className='w-full justify-start'
      >
        <CopyIcon className='h-4 w-4 mr-2' />
        Copy
      </Button>
      <Button
        variant='gray'
        size='inline'
        className='w-full justify-start'
      >
        <TrashIcon className='h-4 w-4 mr-2' />
        Delete
      </Button>
    </div>
  );
};

Actions.Skeleton = function ActionsSkeleton() {
  return (
    <div className='space-y-2 mt-2'>
      <Skeleton className='w-20 h-4 bg-neutral-200' />
      <Skeleton className='w-full h-8 bg-neutral-200' />
      <Skeleton className='w-full h-8 bg-neutral-200' />
    </div>
  );
};
