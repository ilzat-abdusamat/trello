import { z } from 'zod';

export const UpdateCard = z.object({
  boardId: z.string(),
  id: z.string(),
  description: z
    .optional(
      z.string().min(3, { message: 'Description must be at least 3 characters long if provided' })
    )
    .nullable(),
  title: z.optional(
    z.string().min(3, { message: 'Title must be at least 3 characters long if provided' })
  ),
});
