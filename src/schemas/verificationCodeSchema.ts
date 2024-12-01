import {z} from 'zod';

export const verificationCodeSchema = z.object({
    verificationCode: z
        .string()
        .length(6, 'Verification code must be of 6 digits.')
});