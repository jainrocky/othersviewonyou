import { z } from "zod"
import { usernameValidation } from "./signUpSchema"

export const resetPasswordSchema=z.object({
    identifier: z.string().min(2,'Incorrect username or email'),
    redirectURL:z.string()
})