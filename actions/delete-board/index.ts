'use server';

import { createSafeAction } from '@/lib/create-safe-action';
import { DeleteBoard } from './schema';
import { InputType, ReturnType } from './types';
import { auth } from '@clerk/nextjs';
import { db } from '@/lib/db';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

const handler = async (validatedData: InputType): Promise<ReturnType> => {
  const { userId, orgId } = auth();

  if (!userId || !orgId) {
    return {
      error: 'Unauthorized',
    };
  }

  const { id } = validatedData;
  let board;
  try {
    board = await db.board.delete({
      where: {
        id,
        orgId,
      },
    });
  } catch (error) {
    return {
      error: 'Failed to delete.',
    };
  }

  revalidatePath(`/organization/${orgId}`);
  redirect(`/organization/${orgId}`);
};

export const deleteBoard = createSafeAction(DeleteBoard, handler);
