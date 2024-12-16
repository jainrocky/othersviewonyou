'use client'

import { useToast } from "@/hooks/use-toast";
import { updatePasswordSchema } from "@/schemas/updatePasswordSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import axios from "@/lib/axios";
import APIResponse from "@/types/APIResponse";
import { AxiosError } from "axios";



export default function UpdatePassword() {
    const form = useForm<z.infer<typeof updatePasswordSchema>>({
        resolver: zodResolver(updatePasswordSchema),
        defaultValues: {
            password: '',
            identifier: ''
        }
    })
    const [isFormSubmitting, setIsFormSubmitting] = useState(false)
    const { toast } = useToast()
    const { identifier } = useParams<{ identifier: string }>()
    const router = useRouter()
    const onSubmit = async (data: z.infer<typeof updatePasswordSchema>) => {
        setIsFormSubmitting(true)
        try {
            const respone = await axios.post<APIResponse>('/api/update-password', {
                password: data.password,
                identifier: decodeURIComponent(identifier)
            })
            if (respone.data.success) {
                toast({
                    title: "Password Reset Successfully!",
                })
                router.replace('/sign-in')
            } else {
                toast({
                    title: "Failed to update password",
                    description: "Unable to update user password, please try again later.",
                    variant: "destructive"
                })
            }
        } catch (error) {
            const axiosError = error as AxiosError<APIResponse>
            toast({
                title: "Failed to update password",
                description: axiosError.response?.data.message ?? "Unable to update user password, please try again later.",
                variant: "destructive"
            })
        } finally {
            setIsFormSubmitting(false)
        }
    }

    return (
        <div className="flex justify-center items-center min-h-screen">
            <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
                <div className="text-center">

                    <h1 className="text-xl font-bold tracking-tight lg:text-4xl mb-6">
                        OthersViewOnYou
                    </h1>
                    <h2 className="text-xl font-extrabold tracking-tight lg:text-xl mb-6">
                        Update Password
                    </h2>
                </div>
                <Form {...form}>
                    <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>New Password</FormLabel>
                                    <FormControl>
                                        <Input type="password" placeholder="New Password" {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button disabled={isFormSubmitting} type="submit" className='w-full'>
                            {
                                isFormSubmitting ? (<Loader2 className="animate-spin" />) :
                                    'Update Password'
                            }
                        </Button>
                    </form>
                </Form>
            </div>
        </div>
    );
}