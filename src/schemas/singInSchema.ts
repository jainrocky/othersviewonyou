import {z} from 'zod';
import { passwordValidation, usernameValidation } from './singUpSchema';


export const signInSchema=z.object({
    username: usernameValidation,
    password: passwordValidation,
});