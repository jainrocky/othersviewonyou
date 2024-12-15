import dbConnect from "@/lib/dbConnect";
import { createResponse } from "@/lib/helpers";
import UserModel from "@/model/User";
import { usernameValidation } from "@/schemas/signUpSchema";
import { NextRequest } from "next/server";
import { z } from "zod";

export const UserNameQuerySchema=z.object({
    username: usernameValidation
})

//No authorization required for this api
export async function GET(request: NextRequest){
    try{
        const {searchParams}= new URL(request.url)
        const queryParams = {
            username:searchParams.get('username'),
        }
        const {username}=UserNameQuerySchema.parse(queryParams)

        await dbConnect()
        const user = await UserModel.findOne({username:username, isVerified:true})
        if(user){
            return createResponse(false, 'User name is already taken.', 200, {username:username})
        }
        return createResponse(true, 'User name is available.', 200, {username:username})
    }catch(error){
        if(error instanceof z.ZodError){
            console.log('Zod validation error for check username', error)
            const errorFlat = error.flatten()
            return createResponse(false, 'Request Paramaters are incorrect.', 400, errorFlat.fieldErrors)
        }
        console.error('Error in checking username', error)
        return createResponse(false, 'Unable to check username, please try again later.', 500)
    }finally{

    }
}