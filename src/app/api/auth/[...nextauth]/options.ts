// 'use client';

import { ACCESS_TOKEN, REFRESH_TOKEN } from "@/lib/constants";
// import APIResponse from "@/types/APIResponse";
import { AxiosError, AxiosResponse } from "axios";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import axios from "@/lib/axios";
import { request } from "http";
// import axiosInstance from "@/lib/axios";

export const authOptions: NextAuthOptions = {
    secret: process.env.NEXTAUTH_SECRET,
    session: {
        strategy: 'jwt',
    },
    pages: {
        signIn: '/sign-in',
    },
    providers: [
        CredentialsProvider({
            id: "credentials",
            name: "Credentials",
            credentials: {
                identifier: { label: "Username or Email", type: "text", placeholder: "Username or Email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials, req): Promise<any> {
                // Add logic here to look up the user from the credentials supplied
                try {
                    const response: AxiosResponse = await axios.post('/api/getAccessToken', {
                        identifier: credentials?.identifier,
                        password: credentials?.password
                    })
                    // console.log('options.ts: response: ',response)
                    const {success, message, data}=await response.data
                    if(!success){
                        throw new Error(message)
                    }
                    const { accessToken, refreshToken, user} = data
                    return { 
                        ...user,
                        accessToken,
                        refreshToken
                    }
                } catch (error: any) {
                    if(error instanceof AxiosError && error.status===404){
                        throw new Error('Incorrect username or password')
                    }
                    throw new Error('Unable to login, please try again later.')
                }
            }
        })
    ],
    callbacks: {
        async session({ session, user, token }) {
            session.user=token as any
            return session
        },
        async jwt({ token, user, account, profile, isNewUser }) {
            if (user) {
                return { ...token, ...user };
            }
            return token
        }
    }
}