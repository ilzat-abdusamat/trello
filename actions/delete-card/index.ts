'use server';

import { createSafeAction } from '@/lib/create-safe-action';
import { DeleteCard } from './schema';
import { InputType, ReturnType } from './types';
import { auth } from '@clerk/nextjs';
import { db } from '@/lib/db';
import { revalidatePath } from 'next/cache';

const handler = async (validatedData: InputType): Promise<ReturnType> => {
  const { userId, orgId } = auth();

  if (!userId || !orgId) {
    return {
      error: 'Unauthorized',
    };
  }

  const { id, boardId } = validatedData;

  let card;

  try {
    card = await db.card.delete({
      where: {
        id,
      },
    });
  } catch (error) {
    return {
      error: 'Failed to delete.',
    };
  }

  revalidatePath(`/board/${boardId}`);

  return {
    data: card,
  };
};

export const deleteCard = createSafeAction(DeleteCard, handler);
