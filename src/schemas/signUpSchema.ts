import {z} from 'zod';

export const usernameValidation=z
    .string()
    .min(2,'username must be atleast 2 characters.')
    .max(12, 'username must not exceeds 12 characters.')
    .regex(/^[a-zA-Z0-9_]+$/, 'username must not contains special characters.');

export const emalValidation=z
    .string()
    .email('Invalid email address.')

export const passwordValidation=z
    .string()
    .min(6, 'Password must be atleast 6 characters.');

export const signUpSchema=z.object({
    username: usernameValidation,
    email: emalValidation,
    password: passwordValidation,
    redirectURL: z.string()
});