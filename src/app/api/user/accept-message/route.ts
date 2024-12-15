import { ACCESS_TOKEN } from "@/lib/constants";
import dbConnect from "@/lib/dbConnect";
import { checkForValidUser, createResponse } from "@/lib/helpers";
import UserModel, { User } from "@/model/User";
import { acceptingMessageSchema } from "@/schemas/acceptingMessageSchema";
import ValidUserApiResponse from "@/types/ValidUserApiResponse";
import jwt, { JwtPayload, TokenExpiredError } from "jsonwebtoken";
import { NextRequest } from "next/server";
import { z } from "zod";


export async function POST(request: NextRequest) {
    try {
        //TODO: check for valid user token
        // const accessToken = request.cookies.get(ACCESS_TOKEN)?.value
        const accessToken = request.headers.get('authorization')?.split('Bearer ')[1]
        const data = await request.json()
        const parsedData = acceptingMessageSchema.parse(data)
        const { isAcceptingMessage } = parsedData
        const { status, statusCode, message, user }: ValidUserApiResponse = await checkForValidUser(accessToken)

        if (user) {
            user.isAcceptingMessage = isAcceptingMessage
            await user.save()
            return createResponse(true, 'Success.', 200, { isAcceptingMessage: isAcceptingMessage })
        }
        return createResponse(status, message, statusCode)
    } catch (error) {
        if (error instanceof z.ZodError) {
            console.log('Zod validation error for isAcceptingMessage', error.issues)
            const errorFlat = error.flatten()
            return createResponse(false, 'Request Paramaters are incorrect.', 400, errorFlat.fieldErrors)
        }
        if (error instanceof TokenExpiredError) {
            console.error('JWT TokenExpiredError')
            return createResponse(false, 'Access token expired.', 401)
        }
        console.error('Error in updating user message acceptance status', error)
        return createResponse(false, 'Internal server error.', 500)
    } finally {

    }
}

export async function GET(request: NextRequest) {
    try {
        const accessToken = request.headers.get('authorization')?.split('Bearer ')[1]
        const { status, statusCode, message, user }: ValidUserApiResponse = await checkForValidUser(accessToken)
        if (user) {
            return createResponse(true, 'Success.', 200, { isAcceptingMessage: user.isAcceptingMessage })
        }
        return createResponse(false, message, statusCode)
    } catch (error) {
        if (error instanceof TokenExpiredError) {
            console.error('JWT TokenExpiredError')
            return createResponse(false, 'Access token expired.', 401)
        }
        console.error('Error in updating user message acceptance status', error)
        return createResponse(false, 'Internal server error.', 500)
    } finally { }
}