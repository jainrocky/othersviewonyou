import {z} from 'zod';

export const messageSchema = z.object({
    content: z
        .string()
        .min(4, 'Message must be atleast of 4 characters.')
        .max(300, 'Message must not exceeds 300 characters.')
});