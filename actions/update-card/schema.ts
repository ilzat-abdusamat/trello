import { z } from 'zod';

export const UpdateCard = z.object({
  boardId: z.string(),
  id: z.string(),
  description: z
    .optional(z.string().min(3, { message: 'Minimum 3 characters required' }))
    .nullable(),
  title: z.optional(z.string().min(3, { message: 'Minimum 3 characters required' })),
});
