'use client';

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
// import useAxiosAuth from "@/hooks/use-axiosauth";
import { useToast } from "@/hooks/use-toast";
import axios from "@/lib/axios";
import { messageSchema } from "@/schemas/messageSchema";
import APIResponse from "@/types/APIResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";


export default function AnonymousPage() {
    const messageForm = useForm<z.infer<typeof messageSchema>>({
        resolver: zodResolver(messageSchema)
    })
    const params = useParams<{ username: string }>()
    const [isFormSubmitting, setIsFormSubmitting] = useState(false)
    const { toast } = useToast()
    // const axiosAuth = useAxiosAuth()
    const { username } = params
    const content = messageForm.watch('content')

    const onSubmit = async (data: z.infer<typeof messageSchema>) => {
        setIsFormSubmitting(true)
        try {
            const response = await axios.post<APIResponse>('/api/user/send-message', {
                username: username,
                content: data.content
            })
            if (response.data.success) {
                toast({
                    title: "Message sent successfully!"
                })
            } else {
                toast({
                    title: "Failed to send message",
                    description: "Failed to send message, please try again later.",
                    variant: "destructive"
                })
            }
        } catch (error) {
            const axiosError = error as AxiosError<APIResponse>
            toast({
                title: "Failed to send message",
                description: axiosError.response?.data.message ?? "Failed to send message, please try again later.",
                variant: "destructive"
            })
        } finally {
            messageForm.reset({ ...messageForm.getValues(), content: '' });
            setIsFormSubmitting(false)
        }
    }

    return (
        <div className="container mx-auto my-8 p-6 bg-white rounded max-w-4xl">
            <h1 className="text-4xl font-bold mb-6 text-center">
                Public Profile Link
            </h1>
            <Form {...messageForm}>
                <form onSubmit={messageForm.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                        control={messageForm.control}
                        name="content"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Send Anonymous Message to @{username}</FormLabel>
                                <FormControl>
                                    <Textarea
                                        placeholder="Write your anonymous message here"
                                        className="resize-none"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <div className="flex justify-center">
                        {isFormSubmitting ? (
                            <Button disabled>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Please wait
                            </Button>
                        ) : (
                            <Button type="submit" disabled={isFormSubmitting || !content}>
                                Send It
                            </Button>
                        )}
                    </div>
                </form>
            </Form>

            <Separator className="my-6" />
            <div className="text-center">
                <div className="mb-4">Get Your Message Board</div>
                <Link href={'/sign-up'}>
                    <Button>Create Your Account</Button>
                </Link>
            </div>
        </div>
    );
}