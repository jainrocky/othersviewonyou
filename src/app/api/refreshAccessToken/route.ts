import dbConnect from "@/lib/dbConnect";
import { createResponse, generateJWTToken } from "@/lib/helpers";
import UserModel, { User } from "@/model/User";
import { signInSchema } from "@/schemas/signInSchema";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from 'bcrypt'
import jwt, { Jwt, JwtPayload, TokenExpiredError } from 'jsonwebtoken'
import { string, z } from "zod";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "@/lib/constants";
import mongoose from "mongoose";

export const maxDuration = 60


export async function POST(request: NextRequest) {
    try {
        const refreshToken = request.headers.get('authorization')?.split('Bearer ')[1]
        // console.log('refreshToken:value', refreshToken)

        if(!refreshToken){
            return createResponse(false, 'Unauthorized access, refreshToken not found', 401)
        }
        const decodeToken = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET!) as JwtPayload
        if(!decodeToken.exp){
            return createResponse(false, 'Invalid refresh token.', 401)
        }

        const refreshTokenExpired = new Date(decodeToken.exp * 1000) < new Date()

        if(refreshTokenExpired){
            return createResponse(false, 'Refresh token has expired.', 401)
        }

        const {id, username} = decodeToken
        
        await dbConnect()
        
        const validUser:User|null = await UserModel.findById(id)
        
        if(!validUser || validUser.username !== username){
            return createResponse(false, 'User is not found.', 404)
        }
        if(!validUser.isVerified){ // never possible check?
            return createResponse(false, 
                'User is not verified, please verify your email.', 400)
        }
        
        const accessToken= generateJWTToken({
            id: validUser._id,
            username: validUser.username,
            email:validUser.email,
            // isAcceptingMessage: validUser.isAcceptingMessage
        }, 'access')
        
        // const response:NextResponse = createResponse(true, 'Success.', 200)
        //   // Set access token cookie
        // response.cookies.set(ACCESS_TOKEN, accessToken, {
        //     httpOnly: true,
        //     secure: process.env.NODE_ENV === 'production',
        //     path: '/',
        //     maxAge: 15 * 60, // 15 minutes
        //   });
        return createResponse(true, 'Success.', 200, {
            accessToken:accessToken
        })
        // return createResponse(false, 'Internal server error.', 500);
    } catch (error) {
        if(error instanceof TokenExpiredError){
            console.error('JWT TokenExpiredError')
            return createResponse(false, 'Refresh token expired.', 401)
        }
        console.error('Error in refreshing token', error)
        return createResponse(false, 'Internal server error.', 500);
    } finally {
    }


}