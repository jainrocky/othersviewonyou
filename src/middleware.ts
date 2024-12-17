import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
// import jwt, { JwtPayload } from 'jsonwebtoken'
import * as jose from 'jose'


export const maxDuration = 60

const jwtConfig = {
    secret: new TextEncoder().encode(process.env.ACCESS_TOKEN_SECRET),
  }

export async function middleware(request: NextRequest) {
    const token = await getToken({ req: request });
    const url = request.nextUrl;

    if (
        token &&
        (url.pathname.startsWith('/sign-in') ||
            url.pathname.startsWith('/sign-up') ||
            url.pathname.startsWith('/verify') ||
            url.pathname.startsWith('/reset') 
            || url.pathname === '/')
        
    ) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    if (!token && url.pathname.startsWith('/dashboard')) {
        return NextResponse.redirect(new URL('/sign-in', request.url));
    }

    if(!token && url.pathname.startsWith('/reset/update-password')){
        try{
            const token = url.pathname.replace(/^\/reset\/update-password\/[^\/]+\/([^\/]+)$/, '$1')
            const identifier = decodeURIComponent(url.pathname.replace(/^\/reset\/update-password\/([^\/]+)\/.+$/, '$1'))
            // console.log('middleware: reset: identifier: ', identifier)
            const decodeToken:any = await jose.jwtVerify(token, jwtConfig.secret)

            if(decodeToken.payload.username === identifier || decodeToken.payload.email===identifier){
                return NextResponse.next()
            }
            else{
                throw new Error('identifier is not matching with token username or email')
            }
            // console.log('middleware: reset: decodetoken: ', decodeToken.payload.username)
        }catch(error){
            console.log('middleware:reset:error', error)
            return NextResponse.redirect(new URL(`/not-found`, request.url));
        }
        // JWTExpired
    }

    return NextResponse.next();
}
