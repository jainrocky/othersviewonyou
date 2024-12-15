import { z } from "zod";
import { passwordValidation } from "./signUpSchema";

export const updatePasswordSchema=z.object({
    identifier:z.string(),
    password:passwordValidation
})