import { auth } from '@clerk/nextjs';

import { db } from '@/lib/db';
import { MAX_FREE_BOARDS } from '@/constants/boards';

export const incrementAvailableCount = async () => {
  const { orgId } = auth();

  if (!orgId) {
    throw new Error('Unauthorized');
  }

  const orgLimit = await db.orgnizationLimit.findUnique({
    where: { orgId },
  });

  if (orgLimit) {
    await db.orgnizationLimit.update({
      where: {
        orgId,
      },
      data: {
        count: orgLimit.count + 1,
      },
    });
  } else {
    await db.orgnizationLimit.create({
      data: {
        orgId,
        count: 1,
      },
    });
  }
};

export const decreaseAvailableCount = async () => {
  const { orgId } = auth();

  if (!orgId) {
    throw new Error('Unauthorized');
  }

  const orgLimit = await db.orgnizationLimit.findUnique({
    where: { orgId },
  });

  if (orgLimit && orgLimit.count > 0) {
    await db.orgnizationLimit.update({
      where: {
        orgId,
      },
      data: {
        count: orgLimit.count - 1,
      },
    });
  } else {
    await db.orgnizationLimit.create({
      data: {
        orgId,
        count: 1,
      },
    });
  }
};

export const hasAvailableCount = async () => {
  const { orgId } = auth();

  if (!orgId) {
    throw new Error('Unauthorized');
  }

  const orgLimit = await db.orgnizationLimit.findUnique({
    where: { orgId },
  });

  if (!orgLimit || orgLimit.count < MAX_FREE_BOARDS) {
    return true;
  }

  return false;
};

export const getAvailableCount = async () => {
  const { orgId } = auth();

  if (!orgId) {
    return 0;
  }

  const orgLimit = await db.orgnizationLimit.findUnique({
    where: { orgId },
    select: { count: true },
  });

  if (!orgLimit) {
    return 0;
  }

  return orgLimit.count;
};
