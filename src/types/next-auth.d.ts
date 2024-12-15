import 'next-auth';
// import { User } from 'next-auth';



declare module "next-auth" {
  export interface Session {
    user:{
      id:string,
      username:string,
      email:string,
      isAcceptingMessage:boolean,
      accessToken:string,
      refreshToken:string
    }
  }
}

declare module "next-auth/jwt" {
    /**
     * Returned by the `jwt` callback and `getToken`, when using JWT sessions
     */
    export interface JWT {
      data: User;
      error: "RefreshTokenExpired" | "RefreshAccessTokenError";
    }
  }