'use client';

import MessageCard from "@/components/message-card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import useAxiosAuth from "@/hooks/use-axiosauth";
import { useToast } from "@/hooks/use-toast";
import { Message } from "@/model/Message";
import { acceptingMessageSchema } from "@/schemas/acceptingMessageSchema";
import APIResponse from "@/types/APIResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios"
import { Loader2, RefreshCcw } from "lucide-react";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form";
import { z } from "zod";


export default function DashBoardPage() {
    const { data: session } = useSession()
    console.log('session user data: ', session?.user)
    const axiosAuth = useAxiosAuth()
    const { toast } = useToast()
    const [messageList, setMessageList] = useState<Message[]>([])
    const [isMessagesLoading, setIsMessagesLoading] = useState(false)
    const [isSwitchChanging, setIsSwitchChanging] = useState(false)
    // const [last]
    const switchForm = useForm<z.infer<typeof acceptingMessageSchema>>({
        resolver: zodResolver(acceptingMessageSchema)
    })
    const { register, watch, setValue } = switchForm
    const isAcceptingMessage = watch('isAcceptingMessage')

    const fetchMessagesList = async (refresh: boolean = false) => {
        setIsMessagesLoading(true)
        try {
            const response = await axiosAuth.get("/api/user/get-messages")
            console.log('fetchMessagesList:  response', response)
            if (response.data.success) {
                const mList = response.data.data.messages as Message[]
                setMessageList(mList || [])
                if (refresh) {
                    toast({
                        title: 'Refershed Messages',
                        description: 'Showing latest messages.',
                    })
                }
            } else {
                toast({
                    title: 'Failed to Load Messages',
                    description: 'Failed to Load Messages, please try again later.',
                    variant: 'destructive'
                })
            }
        } catch (error) {
            const axiosError = error as AxiosError<APIResponse>
            toast({
                title: "Failed to Load Messages",
                description: axiosError.response?.data.message ?? "Failed to Load Messages, please try again later.",
                variant: "destructive"
            })
        } finally {
            setIsMessagesLoading(false)
        }
    }

    const fetchAcceptMessageStatus = async () => {
        setIsSwitchChanging(true)
        try {
            const response = await axiosAuth.get<APIResponse>("/api/user/accept-message")
            console.log('fetchAcceptMessageStatus:  response', response)
            if (response.data.success) {
                setValue('isAcceptingMessage', response.data.data.isAcceptingMessage)
            } else {
                toast({
                    title: 'Failed to Load User settings',
                    description: 'Failed to Load User settings, please try again later.',
                    variant: 'destructive'
                })
            }
        } catch (error) {
            const axiosError = error as AxiosError<APIResponse>
            toast({
                title: "Failed to Load User settings",
                description: axiosError.response?.data.message ?? "Failed to Load User settings, please try again later.",
                variant: "destructive"
            })
        } finally {
            setIsSwitchChanging(false)
        }
    }

    //This will only update at users end
    const handleDeleteMessage = (messageId: string) => {
        setMessageList(messageList.filter((message) => message._id !== messageId))
    }

    const handleSwitchChange = async () => {
        setIsSwitchChanging(true)
        try {
            const response = await axiosAuth.post('/api/user/accept-message', {
                isAcceptingMessage: !isAcceptingMessage
            })
            if (response.data.success && session) {
                session.user.isAcceptingMessage = response.data.data.isAcceptingMessage
                setValue('isAcceptingMessage', response.data.data.isAcceptingMessage)
                toast({
                    title: "Success",
                    description: "User setting updated successfully"
                })
            } else {
                toast({
                    title: "Failed to update User settings",
                    description: response.data.message ?? "Unable to update user settings, please try again later.",
                    variant: "destructive"
                })
            }
        } catch (error) {
            // console.error('onSubmit', error)
            const axiosError = error as AxiosError<APIResponse>
            toast({
                title: "Failed to update User settings",
                description: axiosError.response?.data.message ?? "Unable to update user settings, please try again later.",
                variant: "destructive"
            })
        } finally {
            setIsSwitchChanging(false)
        }
    }
    const handleCopyToClipboard = () => {
        navigator.clipboard.writeText(profileUrl)
        toast({
            title: 'Copied to clipboard',
            description: "URL copied successfully!"
        })
    }

    useEffect(() => {
        if (!session || !session.user) return
        fetchMessagesList()
        fetchAcceptMessageStatus()
    }, [session])

    if (!session || !session.user) return (<></>)

    const profileUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/u/${session.user.username}`

    return (
        <div className="my-8 mx-4 md:mx-8 lg:mx-auto p-6 bg-white rounded w-full max-w-6xl min-h-screen">
            <h1 className="text-4xl font-bold mb-4">Dashboard</h1>

            <div className="mb-4">
                <h2 className="text-lg font-semibold mb-2">Copy Your Unique Link</h2>{' '}
                <div className="flex items-center">
                    <input
                        type="text"
                        value={profileUrl}
                        disabled
                        className="input input-bordered w-full p-2 mr-2"
                    />
                    <Button onClick={handleCopyToClipboard}>Copy</Button>
                </div>
            </div>

            <div className="mb-4">
                <Switch
                    {...register('isAcceptingMessage')}
                    checked={isAcceptingMessage}
                    onCheckedChange={handleSwitchChange}
                    disabled={isSwitchChanging}
                />
                <span className="ml-2">
                    Accept Messages: {isAcceptingMessage ? 'On' : 'Off'}
                </span>
            </div>
            <Separator />

            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            className="mt-4"
                            variant="outline"
                            onClick={(e) => {
                                e.preventDefault();
                                fetchMessagesList(true);
                            }}
                        >
                            {isMessagesLoading ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                <RefreshCcw className="h-4 w-4" />
                            )}
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>Refresh Messages</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                {messageList.length > 0 ? (
                    messageList.map((message, index) => (
                        <MessageCard
                            key={message._id as string}
                            message={message}
                            onMessageDelete={handleDeleteMessage}
                        />
                    ))
                ) : (
                    <p>No messages to display.</p>
                )}
            </div>
        </div>
    )
}