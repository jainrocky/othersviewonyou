import VerificationEmail from "@/components/verification-email-template";
import { resend } from "./resend";
import { VERIFICATION_EMAIL_SUBJECT, RESET_PASSWORD_EMAIL_SUBJECT } from '@/lib/constants'
import { NextResponse } from "next/server";
import jwt, { JwtPayload } from 'jsonwebtoken'
import ValidUserApiResponse from "@/types/ValidUserApiResponse";
import dbConnect from "./dbConnect";
import UserModel, { User } from "@/model/User";
import ResetPasswordEmail from "@/components/reset-password-email-template";

export function createResponse(successStatus: boolean, message: string, status = 200, data?: any): NextResponse {
    if (data) {
        return NextResponse.json({
            success: successStatus,
            message: message,
            data: data
        }, { status: status });
    }
    return NextResponse.json({
        success: successStatus,
        message: message,
    }, { status: status });
}


export function generateVerificationCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
}


export async function sendVerificationEmail(
    username: string,
    email: string,
    verificationCode: string,
    redirectURL: string
) {
    try {
        // console.log('sendVerificationEmail: redirectURl: ', redirectURL)
        await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: email,
            subject: VERIFICATION_EMAIL_SUBJECT,
            react: VerificationEmail({ username, verificationCode, redirectURL }),
        })
        return {
            'success': true,
            'message': 'Verification email sent successfully.'
        }
    } catch (error) {
        console.error('Failed to send verification email', error)
        return {
            'success': false,
            'message': 'Failed to sent verification email.'
        }
    }
}


export async function sendResetPasswordEmail(
    username: string,
    email: string,
    redirectURL: string
) {
    try {
        // console.log('sendVerificationEmail: redirectURl: ', redirectURL)
        await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: email,
            subject: RESET_PASSWORD_EMAIL_SUBJECT,
            react: ResetPasswordEmail({ username, redirectURL }),
        })
        return {
            'success': true,
            'message': 'Password Reset Email sent successfully.'
        }
    } catch (error) {
        console.error('Failed to send Reset Password Email', error)
        return {
            'success': false,
            'message': 'Failed to send Reset Password Email.'
        }
    }
}

export function generateJWTToken(data: {}, type: 'access' | 'refresh') {
    if (type === 'access') {
        return jwt.sign(
            data,
            process.env.ACCESS_TOKEN_SECRET || '',
            { expiresIn: '5m' }
        )
    }
    return jwt.sign(
        data,
        process.env.REFRESH_TOKEN_SECRET || '', {
        expiresIn: '7d'
    })
}


export async function checkForValidUser(accessToken: string | undefined): Promise<ValidUserApiResponse> {

    if (!accessToken) {
        return { status: false, message: 'Unauthorized access.', statusCode: 401 }
    }

    const _decodeToken = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET!) as JwtPayload
    if (!_decodeToken.exp) {
        return { status: false, message: 'Invalid access token.', statusCode: 401 }
    }

    const _accessTokenExpired = new Date(_decodeToken.exp * 1000) < new Date()
    if (_accessTokenExpired) {
        return { status: false, message: 'Access token has expired.', statusCode: 401 }
    }

    const { id, username } = _decodeToken

    await dbConnect()
    const validUser: User | null = await UserModel.findById(id)

    if (!validUser || validUser.username !== username) {
        return { status: false, message: 'User is not found.', statusCode: 401 }
    }
    if (!validUser.isVerified) { // is this a never possible check?
        return { status: false, message: 'User is not verified, please verify your email.', statusCode: 400 }
    }

    return { status: true, message: 'Success.', statusCode: 200, user: validUser }
}