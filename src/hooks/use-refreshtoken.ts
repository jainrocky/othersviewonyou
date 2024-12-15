'use client';

import axios from "@/lib/axios";
import APIResponse from "@/types/APIResponse";
import { AxiosError } from "axios";
import { useSession } from "next-auth/react"

const useRefreshToken = () => {
    const { data: session } = useSession()
    

    const refreshToken = async ():Promise<APIResponse> => {
        // console.log('useRefreshToken>refreshToken:called')
        // console.log('useRefreshToken>session>refreshToken:', session?.user.refreshToken)
        var response
        try{
            response = await axios.post('/api/refreshAccessToken', {}, {
                headers: { 'Authorization': `Bearer ${session?.user.refreshToken}` }
            })
            // console.log('useRefreshToken:response', response)
            if (session && response.data.success) session.user.accessToken = response.data.data.accessToken
            return response.data

        }catch(error){
            if(error instanceof AxiosError){
                return {success: false, message: error.message}
            }
            // console.log('useRefreshToken:error', response?.data)
            return response?.data
        }
        
    }
    return refreshToken
}

export default useRefreshToken