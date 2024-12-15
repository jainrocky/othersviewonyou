import dbConnect from "@/lib/dbConnect";
import { createResponse, sendResetPasswordEmail } from "@/lib/helpers";
import UserModel from "@/model/User";
import { resetPasswordSchema } from "@/schemas/resetPasswordSchema";
import { NextRequest } from "next/server";
import { z } from "zod";

export async function POST(request: NextRequest) {
    try {
        const data = await request.json()
        const { identifier, redirectURL } = resetPasswordSchema.parse(data)

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
        const emailResponse = await sendResetPasswordEmail(validUser.username,validUser.email ,redirectURL)

        if(!emailResponse.success){
            return createResponse(false, emailResponse.message, 400)
        }
        return createResponse(true, 'Reset password link is sent to the user email.', 200)
    } catch (error) {
        if (error instanceof z.ZodError) {
            console.log('Zod validation error for reset password', error)
            const errorFlat = error.flatten()
            return createResponse(false, 'Request Paramaters are incorrect.', 400, errorFlat.fieldErrors)
        }
        console.error('Error in reset password', error)
        return createResponse(false, 'Unable to reset password, please try again later.', 500)
    } finally { }
}