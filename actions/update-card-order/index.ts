'use server';

import { InputType, ReturnType } from './types';
import { auth } from '@clerk/nextjs';
import { db } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { createSafeAction } from '@/lib/create-safe-action';
import { UpdateCardOrder } from './schema';

const handler = async (data: InputType): Promise<ReturnType> => {
  const { userId, orgId } = auth();

  if (!userId || !orgId) {
    return {
      error: 'Unauthorized',
    };
  }

  const { boardId, items } = data;

  let updatedCards;

  try {
    const transacion = items.map((card) =>
      db.card.update({
        where: {
          id: card.id,
          list: {
            board: {
              orgId,
            },
          },
        },
        data: {
          order: card.order,
          listId: card.listId,
        },
      })
    );

    updatedCards = await db.$transaction(transacion);
  } catch (error) {
    return {
      error: 'Failed to reorder.',
    };
  }

  revalidatePath(`board/${boardId}/`);
  return {
    data: updatedCards,
  };
};

export const updateCardOrder = createSafeAction(UpdateCardOrder, handler);
