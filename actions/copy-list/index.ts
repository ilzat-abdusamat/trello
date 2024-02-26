'use server';

import { createSafeAction } from '@/lib/create-safe-action';
import { CopyList } from './schema';
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

  let list;

  try {
    const listToCopy = await db.list.findUnique({
      where: {
        id,
        boardId,
        board: {
          orgId,
        },
      },
      include: { cards: true },
    });

    if (!listToCopy) {
      return {
        error: 'List not found',
      };
    }

    const lastList = await db.list.findFirst({
      where: { boardId },
      orderBy: { order: 'desc' },
      select: { order: true },
    });

    const newOrder = lastList ? lastList.order + 1 : 1;

    list = await db.list.create({
      data: {
        boardId: listToCopy.boardId,
        order: newOrder,
        title: listToCopy.title + ' - Copy',
        cards: {
          createMany: {
            data: listToCopy.cards.map((card) => {
              return {
                title: card.title,
                description: card.description,
                order: card.order,
              };
            }),
          },
        },
      },
      include: {
        cards: true,
      },
    });
  } catch (error) {
    return {
      error: 'Failed to copy.',
    };
  }

  await CreateAuditLog({
    entityId: list.id,
    entityType: ENTITY_TYPE.LIST,
    entityTitle: list.title,
    action: ACTION.CREATE,
  });

  revalidatePath(`/board/${boardId}`);

  return {
    data: list,
  };
};

export const copyList = createSafeAction(CopyList, handler);
