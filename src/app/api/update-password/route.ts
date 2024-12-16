import dbConnect from "@/lib/dbConnect";
import { createResponse } from "@/lib/helpers";
import UserModel from "@/model/User";
import { updatePasswordSchema } from "@/schemas/updatePasswordSchema";
import { NextRequest } from "next/server";
import { z } from "zod";
import bcrypt from 'bcrypt'

export const maxDuration = 60


export async function POST(request: NextRequest) {
    try {
        const data = await request.json()
        const { identifier, password } = updatePasswordSchema.parse(data)
        
        console.log('update-password: query: ', identifier, password)
        await dbConnect()
        const validUser = await UserModel.findOne({
            $and: [
                {
                    $or: [
                        { username: identifier },
                        { email: identifier },
                    ]
                },
                { isVerified: true }
            ]
        })

        if(!validUser){
            return createResponse(false, 'User is not found.', 404)
        }

        const hashedPassword = await bcrypt.hash(password, Number(process.env.SALT_OR_ROUNDS))
    
        validUser.password=hashedPassword
        await validUser.save()
        
        return createResponse(true, 'User password updated successfully.', 200)
    } catch (error) {
        if (error instanceof z.ZodError) {
            console.error('Zod validation error for update password', error.issues)
            const errorFlat = error.flatten()
            return createResponse(false, 'Request Paramaters are incorrect.', 400, errorFlat.fieldErrors)
        }
        console.error('User update password failed', error)
        return createResponse(false, 'User update password failed', 500)
    } finally {

    }
}