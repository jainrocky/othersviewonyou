import dbConnect from "@/lib/dbConnect";
import { createResponse } from "@/lib/helpers";
import UserModel, { User } from "@/model/User";
import { signInSchema } from "@/schemas/signInSchema";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from 'bcrypt'
import jwt, { Jwt, JwtPayload } from 'jsonwebtoken'
import { string, z } from "zod";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "@/lib/constants";
import mongoose from "mongoose";

export async function DELETE(request: NextRequest) {
    try {
        const response = createResponse(true, 'Success.', 200)
        response.cookies.delete(REFRESH_TOKEN)
        response.cookies.delete(ACCESS_TOKEN)
        return response
    } catch (error) {
        console.error('Error in deleting access token', error)
        return createResponse(false, 'Internal server error.', 500);
    } finally {
        
    }
}