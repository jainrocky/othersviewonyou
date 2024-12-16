import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
// import jwt, { JwtPayload } from 'jsonwebtoken'
import * as jose from 'jose'

const jwtConfig = {
    secret: new TextEncoder().encode(process.env.ACCESS_TOKEN_SECRET),
  }

export async function middleware(request: NextRequest) {
    const token = await getToken({ req: request });
    const url = request.nextUrl;
    if(url.pathname.startsWith('/reset/update-password')){
        try{
            const token = url.pathname.replace(/^\/reset\/update-password\/[^\/]+\/([^\/]+)$/, '$1');
            // console.log('middleware: reset: token: ', token)
            const decodeToken:any = await jose.jwtVerify(token, jwtConfig.secret)
            // console.log('middleware: reset: decodetoken: ', decodeToken.payload.username)
            return NextResponse.next()
        }catch(error){
            console.log('middleware:reset:error', error)
            return NextResponse.redirect(new URL(`/not-found`, request.url));
        }
        
        
        // JWTExpired
    }


    if (
        token &&
        (url.pathname.startsWith('/sign-in') ||
            url.pathname.startsWith('/sign-up') ||
            url.pathname.startsWith('/verify') ||
            url.pathname.startsWith('/reset')
            // url.pathname === '/'
        )
    ) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    if (!token && url.pathname.startsWith('/dashboard')) {
        return NextResponse.redirect(new URL('/sign-in', request.url));
    }
    return NextResponse.next();
}
