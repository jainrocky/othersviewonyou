import dbConnect from "@/lib/dbConnect";
import { createResponse, generateJWTToken } from "@/lib/helpers";
import UserModel, { User } from "@/model/User";
import { signInSchema } from "@/schemas/signInSchema";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from 'bcrypt'
import jwt, { JwtPayload } from 'jsonwebtoken'
import { z } from "zod";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "@/lib/constants";

export async function POST(request: NextRequest) {
    try {
        //TODO: check if refresh access token is already available and not expired
        // const _refreshToken = request.cookies?.get(REFRESH_TOKEN)?.value
        // if (_refreshToken) {
        //     const decodeToken = jwt.decode(_refreshToken) as JwtPayload
        //     if (decodeToken.exp) {
        //         const refreshTokenExpired = new Date(decodeToken.exp * 1000) < new Date()
        //         if (!refreshTokenExpired) {//refresh token is not expired, user should use refreshAccessToken API in this case.
        //             return createResponse(false, 'Cannot generate access token, refresh token already available.', 400)
        //         }
        //     }
        // }
        const data = await request.json()
        const parsedData = signInSchema.parse(data)
        const { identifier, password }: { identifier: string, password: string } = parsedData

        await dbConnect()
        const user: User | null = await UserModel.findOne(
            {
                $or: [
                    { username: identifier },
                    { email: identifier },
                ],
            }
        )
        if (!user) {
            return createResponse(false, 'Incorrect username or email.', 404)
        }
        if(!user.isVerified){
            return createResponse(false, 
                'User is not verified, please verify your email.', 400)
        }

        const passwordMatched: boolean = await bcrypt.compare(password, user.password)

        if (!passwordMatched) {
            return createResponse(false, 'Incorrect user password', 404)
        }

        // user credentials are valid, required to login user.
        const accessToken = generateJWTToken({
            id: user._id,
            username: user.username,
            email:user.email,
            // isAcceptingMessage: user.isAcceptingMessage
        }, 'access')

        const refreshToken = generateJWTToken({
            id: user._id,
            username: user.username,
            email:user.email,
            // isAcceptingMessage: user.isAcceptingMessage
        }, 'refresh')

        return createResponse(true, 'Success.', 200, {
            refreshToken: refreshToken,
            accessToken: accessToken,
            user: {
                id: user._id,
                username: user.username,
                email:user.email,
                isAcceptingMessage:user.isAcceptingMessage
            },
        })
    } catch (error) {
        if (error instanceof z.ZodError) {
            console.log('Zod validation error for get access token', error.issues)
            const errorFlat = error.flatten()
            return createResponse(false, 'Request Paramaters are incorrect.', 400, errorFlat.fieldErrors)
        }
        console.error('Error in user login', error)
        return createResponse(false, 'Error in user login', 500);
    } finally {
    }


}