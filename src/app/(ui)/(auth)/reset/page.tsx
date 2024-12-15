'use client';
import { resetPasswordSchema } from "@/schemas/resetPasswordSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import axios from "@/lib/axios";
import APIResponse from "@/types/APIResponse";
import { useRouter } from "next/navigation";
import { AxiosError } from "axios";
import jwt from 'jsonwebtoken'


export default function ResetPassword() {
    const [isFormSubmitting, setIsFormSubmitting] = useState(false)
    const { toast } = useToast()
    const form = useForm<z.infer<typeof resetPasswordSchema>>({
        resolver: zodResolver(resetPasswordSchema),
        defaultValues: {
            identifier: '',
            redirectURL: ''
        }
    })
    const router = useRouter()

    // const emaiLinkexp = '1m'

    const onSubmit = async (data: z.infer<typeof resetPasswordSchema>) => {
        setIsFormSubmitting(true)
        try {
            // var urlToken = genRedirectURLToken(data.identifier, emaiLinkexp)
            // console.log('urltoken: ', urlToken)
            const response = await axios.post<APIResponse>('/api/reset-password', {
                identifier: data.identifier,
                // redirectURL: `${process.env.NEXT_PUBLIC_BASE_URL}/reset/${urlToken}`,
                redirectURL: `${process.env.NEXT_PUBLIC_BASE_URL}/reset/${data.identifier}`,
            })
            if (response.data.success) {
                toast({
                    title: `Reset Password link sent to your email.`
                })
                router.replace(`/`)
            } else {
                if (response.status === 404) {
                    toast({
                        title: "User not found",
                        description: response.data.message,
                        variant: "destructive"
                    })
                }
                toast({
                    title: "Failed to sent reset link",
                    description: "Unable to sent reset password link to your email, please try again later.",
                    variant: "destructive"
                })
            }
        } catch (error) {
            console.log(error)
            const axiosError = error as AxiosError<APIResponse>
            toast({
                title: "Failed to sent reset link",
                description: axiosError.response?.data.message ?? "Unable to sent reset password link to your email, please try again later.",
                variant: "destructive"
            })
        } finally { setIsFormSubmitting(false) }
    }

    return (
        <div className="flex justify-center items-center min-h-screen">
            <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
                <div className="text-center">

                    <h1 className="text-xl font-bold tracking-tight lg:text-4xl mb-6">
                        OthersViewOnYou
                    </h1>
                    <h2 className="text-xl font-extrabold tracking-tight lg:text-xl mb-6">
                        Reset Password
                    </h2>
                </div>
                <Form {...form}>
                    <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
                        <FormField
                            control={form.control}
                            name="identifier"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Username or Email</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Username or Email" {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button disabled={isFormSubmitting} type="submit" className='w-full'>
                            {
                                isFormSubmitting ? (<Loader2 className="animate-spin" />) :
                                    'Send Reset Link'
                            }
                        </Button>
                    </form>
                </Form>
            </div>
        </div>
    );
}


// function genRedirectURLToken(identifier: string, expiresIn: string): string {
//     var redirectURLToken = jwt.sign(
//         { identifier: identifier },
//         process.env.NEXT_PUBLIC_REDIRECT_URL_SECERET||'',
//         { expiresIn: expiresIn }
//     )
//     return redirectURLToken
// }