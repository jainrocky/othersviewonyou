import { ACCESS_TOKEN } from "@/lib/constants";
import { checkForValidUser, createResponse } from "@/lib/helpers";
import ValidUserApiResponse from "@/types/ValidUserApiResponse";
import { error } from "console";
import { TokenExpiredError } from "jsonwebtoken";
import { NextRequest } from "next/server";

export const maxDuration = 60


export async function DELETE(request: NextRequest, {params}:{params: Promise<{messageId:string}>}){
    try{
        // const accessToken=request.cookies.get(ACCESS_TOKEN)?.value
        const accessToken = request.headers.get('authorization')?.split('Bearer ')[1]
        const {messageId}= await params
        const validUserRes:ValidUserApiResponse=await checkForValidUser(accessToken)
        if(!validUserRes.user){
            return createResponse(false, 'Unauthorized, User is not found', 404)
        }
        // validUserRes.user.messages.re
        const result = await validUserRes.user.updateOne(
            {$pull: {messages: {_id: messageId}}}
        )
        // console.log(result)
        if(result.modifiedCount === 0){   
            return createResponse(false, 'Message not found or already deleted.', 404)
        }
        return createResponse(true, 'Message deleted', 200)
    }catch(error){
        if(error instanceof TokenExpiredError){
            console.error('JWT TokenExpiredError')
            return createResponse(false, 'Access token expired.', 401)
        }
        console.error('Error in deleteing message', error)
        return createResponse(false, 'Unable to delete message, try again later.', 500)
    }finally{

    }
}