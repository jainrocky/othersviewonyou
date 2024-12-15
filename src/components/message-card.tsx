'use client';

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { Message } from "@/model/Message";
import { Button } from "./ui/button";
import { Delete, DeleteIcon, LucideDelete, Trash, Trash2 } from "lucide-react";
import useAxiosAuth from "@/hooks/use-axiosauth";
import { useToast } from "@/hooks/use-toast";
import APIResponse from "@/types/APIResponse";
import { AxiosError } from "axios";
import dayjs from 'dayjs'

export default function MessageCard({ message, onMessageDelete }: { message: Message, onMessageDelete: (messageId: string) => void }) {
    const axiosAuth = useAxiosAuth()
    const { toast } = useToast()
    const handleDeleteMessage = async () => {
        onMessageDelete(message._id as string)
        try {
            const response = await axiosAuth.delete<APIResponse>(`/api/user/delete-message/${message._id}`)
            if (response.data.success) {
                toast({
                    title: "Message deleted successfully!"
                })
            } else {
                toast({
                    title: "Failed to delete message",
                    description: response.data.message ?? '',
                    variant: "destructive"
                })
            }
        } catch (error) {
            const axiosError = error as AxiosError<APIResponse>
            toast({
                title: "Failed to delete message",
                description: axiosError.response?.data.message ?? "Unable to delete message, please try again later.",
                variant: "destructive"
            })
        } finally { }
    }

    return (
        <Card className="card-bordered">
            <CardHeader>
                <CardTitle>{message.content}</CardTitle>
            </CardHeader>
            <CardContent>
                {dayjs(message.createdAt).format('MMM D, YYYY h:mm A')}
            </CardContent>
            <CardFooter>
                <AlertDialog>
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <AlertDialogTrigger asChild>
                                    <Button variant="destructive">
                                        <Trash2 className="w-5 h-5" />
                                    </Button>
                                </AlertDialogTrigger>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Delete This Mesage</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete your message.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={handleDeleteMessage}>Delete</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </CardFooter>
        </Card>
    );
}