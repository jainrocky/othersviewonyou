'use client';

import axios, { axiosAuth } from "@/lib/axios";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import useRefreshToken from "./use-refreshtoken";
import { error } from "console";

const useAxiosAuth = () => {
    const { data: session } = useSession()
    const refreshToken = useRefreshToken()
    // console.log('useAxiosAuth: accessToken: ', session?.user.accessToken)

    useEffect(() => {
        const requestIntercept = axiosAuth.interceptors.request.use((config) => {
            if (!config.headers["Authorization"]) {
                config.headers['Authorization'] = `Bearer ${session?.user.accessToken}`
            }
            return config
        }, (error)=>Promise.reject(error))

        const responseIntercept = axiosAuth.interceptors.response.use((response) => response,
            async (error) => {
                // console.log('responseIntercept>error', error)
                const prevRequest=error.config
                if(error.response.status===401 && !prevRequest.sent){
                    // console.log('responseIntercept>error>inside if')
                    prevRequest.sent=true
                    const refreshTokenresponse = await refreshToken()
                    // console.log('use-axiosauth.ts>refreshTokenresponse',refreshTokenresponse)
                    prevRequest.headers['Authorization']=`Bearer ${session?.user.accessToken}`
                    return axiosAuth(prevRequest)
                }
                return Promise.reject(error)
            }
        )


        return () => {
            axiosAuth.interceptors.request.eject(requestIntercept)
            axiosAuth.interceptors.response.eject(responseIntercept)
        }

    }, [session])

    return axiosAuth
}

export default useAxiosAuth