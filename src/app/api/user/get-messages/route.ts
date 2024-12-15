import { ACCESS_TOKEN } from "@/lib/constants"
import { checkForValidUser, createResponse } from "@/lib/helpers"
import UserModel from "@/model/User"
import ValidUserApiResponse from "@/types/ValidUserApiResponse"
import { TokenExpiredError } from "jsonwebtoken"
import { NextRequest } from "next/server"


export async function GET(request: NextRequest) {
    try {
        
        // const accessToken = request.cookies.get(ACCESS_TOKEN)?.value
        const accessToken = request.headers.get('authorization')?.split('Bearer ')[1]
        // console.log('get-message api called: accessToken: ',accessToken)
        const { status, statusCode, message, user }: ValidUserApiResponse = await checkForValidUser(accessToken)
        if (!user) {
            return createResponse(status, message, statusCode)
        }
        user.messages.sort((a,b) => b.createdAt.getTime()-a.createdAt.getTime())
        return createResponse(true, 'Success.', 200, {
            id: user._id,
            messages: user.messages
        })
    } catch (error) {
        if(error instanceof TokenExpiredError){
            console.error('JWT TokenExpiredError')
            return createResponse(false, 'Access token expired.', 401)
        }
        console.error('Error in get messages', error)
        return createResponse(false, 'Internal server error.', 500)
    } finally {

    }

}