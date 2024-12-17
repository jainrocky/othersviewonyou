'use client';

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { verificationCodeSchema } from "@/schemas/verificationCodeSchema";
import APIResponse from "@/types/APIResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { Axios, AxiosError } from "axios";
import { Loader2 } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

export default function CodeVerificationPage() {
    const [submittingForm, setSubmittingForm] = useState(false)
    const router = useRouter()
    const params = useParams()
    const { toast } = useToast()
    const verifyForm = useForm<z.infer<typeof verificationCodeSchema>>({
        defaultValues: {
            verificationCode: ''
        },
        resolver: zodResolver(verificationCodeSchema)
    })

    const onSubmit = async (data: z.infer<typeof verificationCodeSchema>) => {
        setSubmittingForm(true)
        try {
            const response = await axios.post<APIResponse>(`/api/verifyEmail`, {
                username: params.username,
                verificationCode: data.verificationCode
            })
            // console.log('onSubmit: ', response)
            if (!response.data.success) {
                toast({
                    title: "Failed",
                    description: response.data.message,
                    variant: "destructive"
                })
            }
            toast({
                title: "Success",
                description: response.data.message,
                // variant:"destructive"
            })
            router.replace(`/sign-in`)
        } catch (error) {
            const axiosError = error as AxiosError<APIResponse>
            toast({
                title: "Error",
                description: axiosError.response?.data.message,
                variant: "destructive"
            })
        } finally {
            setSubmittingForm(false)
        }


    }

    return (
        <div className="flex justify-center items-center min-h-screen">
            <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
                <div className="text-center">
                    <h2 className="text-xl font-extrabold tracking-tight lg:text-xl mb-6">
                        Verify your Account On
                    </h2>
                    <h1 className="text-xl font-bold tracking-tight lg:text-4xl mb-6">
                        OthersViewOnYou

                    </h1>
                </div>
                <Form {...verifyForm}>
                        <form className="space-y-6" onSubmit={verifyForm.handleSubmit(onSubmit)}>
                            <FormField
                                control={verifyForm.control}
                                name="verificationCode"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Verification Code</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Enter your verification code" {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button disabled={submittingForm} type="submit" className='w-full'>
                                {
                                    submittingForm?(<Loader2 />): 'Verify Account'
                                }
                            </Button>
                        </form>
                    </Form>
            </div>
        </div>
    );
}