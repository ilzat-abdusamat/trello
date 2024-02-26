'use server';

import { createSafeAction } from '@/lib/create-safe-action';
import { DeleteCard } from './schema';
import { InputType, ReturnType } from './types';
import { auth } from '@clerk/nextjs';
import { db } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { CreateAuditLog } from '@/lib/create-audit-log';
import { ACTION, ENTITY_TYPE } from '@prisma/client';

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

    await CreateAuditLog({
      entityId: card.id,
      entityType: ENTITY_TYPE.CARD,
      entityTitle: card.title,
      action: ACTION.DELETE,
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
