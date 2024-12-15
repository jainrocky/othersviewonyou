import { createResponse, generateVerificationCode, sendVerificationEmail } from "@/lib/helpers";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from 'bcrypt'
import { signUpSchema } from "@/schemas/signUpSchema";
import * as z from 'zod'

export const maxDuration = 60


export async function POST(request: NextRequest) {
    try {
        // // console.log('ENTERED createAccount', Date.now())
        const data = await request.json()
        const parsedData = signUpSchema.parse(data)
        const { username, email, password, redirectURL } = parsedData;

        await dbConnect();
        const existUsername = await UserModel.findOne({
            username: username,
            isVerified: true,
        })
        if (existUsername) {
            return createResponse(false, 'Username already exist.', 409)
        }

        const existUserWithThisEmail = await UserModel.findOne({ email: email, })
        // console.log('existUserWithThisEmail query executed', Date.now())
        const verificationCode = generateVerificationCode()
        // console.log('verificationCode generated', Date.now())
        if (existUserWithThisEmail) {
            if (existUserWithThisEmail.isVerified) {
                return createResponse(false, 'User already exist with this email.', 409)
            } else {
                const codeExpiry = new Date();
                codeExpiry.setHours(codeExpiry.getHours() + 1)
                const hashedPassword = await bcrypt.hash(password, Number(process.env.SALT_OR_ROUNDS))

                existUserWithThisEmail.verificationCode = verificationCode
                existUserWithThisEmail.codeExpiry = codeExpiry
                existUserWithThisEmail.password = hashedPassword

                await existUserWithThisEmail.save()
            }
        } else {
            const codeExpiry = new Date();
            codeExpiry.setHours(codeExpiry.getHours() + 1)
            // // console.log(Number(process.env.SALT_OR_ROUNDS))
            const hashedPassword = await bcrypt.hash(password, Number(process.env.SALT_OR_ROUNDS))
            // console.log('hashedPassword encrypted', Date.now())
            const newUser = new UserModel({
                username: username,
                email: email,
                password: hashedPassword,
                codeExpiry: codeExpiry,
                verificationCode: verificationCode,
            })
            // console.log('new user initialized', Date.now())
            await newUser.save()
            // console.log('new user saved', Date.now())
        }
        //TODO: send Email with verification code
        // console.log('sending verification email', Date.now())
        const emailResponse = await sendVerificationEmail(username, email, verificationCode, redirectURL)
        // console.log('verification email sent', Date.now())
        if (!emailResponse.success) {
            // console.error('Error in sending verification email', emailResponse.message)
            return createResponse(false, emailResponse.message, 500)
        }
        // console.log('User registered successfully. A verification email has been sent to your registered email address.')
        return createResponse(true,
            'User registered successfully. A verification email has been sent to your registered email address.', 201)
    } catch (error) {
        if (error instanceof z.ZodError) {
            console.error('Zod validation error for account creation', error.issues)
            const errorFlat = error.flatten()
            return createResponse(false, 'Request Paramaters are incorrect.', 400, errorFlat.fieldErrors)
        }
        console.error('User registration failed', error)
        return createResponse(false, 'User registration failed', 500)
    }
    finally {
    }
}