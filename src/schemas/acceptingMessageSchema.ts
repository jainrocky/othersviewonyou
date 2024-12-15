import {z} from 'zod';

export const acceptingMessageSchema = z.object({
    isAcceptingMessage: z.boolean()
});