import dbConnect from "@/lib/dbConnect";
import { createResponse } from "@/lib/helpers";
import UserModel from "@/model/User";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const { username, verificationCode } = await request.json()
        
        await dbConnect();
        const unverifiedUser = await UserModel.findOne({ username: username })
        if (!unverifiedUser) {
            return createResponse(false, 'User does not exist.', 404)
        }

        if(unverifiedUser.isVerified){
            return createResponse(false, 'User already verified.', 409)
        }

        const isVerificationCodeExpired = new Date(unverifiedUser.codeExpiry) < new Date()
        const verificationCodeMatched = unverifiedUser.verificationCode === verificationCode

        if(isVerificationCodeExpired){
            return createResponse(false, 'The verification code has expired. Please sign up again to receive a new code.', 400)
        }else if(!isVerificationCodeExpired && !verificationCodeMatched){
            return createResponse(false, 'Incorrect verification code.', 400)
        }
        
        unverifiedUser.isVerified=true;
        await unverifiedUser.save()
        return createResponse(true, 'User verified successfully.', 200)
    } catch (error) { 
        console.error('Error in user verification', error)
        return createResponse(false, 'Error in user verification.', 500)
    }
    finally{

    }
}