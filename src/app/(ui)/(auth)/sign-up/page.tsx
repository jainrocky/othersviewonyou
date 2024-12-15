'use client';

import * as z from "zod";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDebounceCallback } from 'usehooks-ts'
import { signUpSchema } from "@/schemas/signUpSchema";
import { zodResolver } from '@hookform/resolvers/zod';
import axios, { AxiosError } from 'axios'
import APIResponse from "@/types/APIResponse";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";


export default function SignUpPage() {
    const [username, setUsername] = useState('')
    const [usernameMessage, setUsernameMessage] = useState('')
    const [chekingUsername, setCheckingUsername] = useState(false)
    const [submittingForm, setSubmittingForm] = useState(false)

    const debouncedUsername = useDebounceCallback(setUsername, 500)
    const router = useRouter()
    const { toast } = useToast()

    const signUpForm = useForm<z.infer<typeof signUpSchema>>({
        resolver: zodResolver(signUpSchema),
        defaultValues: {
            username: "",
            email: "",
            password: "",
            redirectURL: ''
        },
    })

    useEffect(() => {
        const checkIsUsernameUnique = async () => {
            setUsernameMessage('')
            if (username) {
                setCheckingUsername(true)
                try {
                    const response = await axios.get<APIResponse>(`/api/check-username?username=${username}`)
                    // console.log('checkIsUsernameUnique|try: ', response)
                    setUsernameMessage(response.data.message)
                } catch (error) {
                    // console.error('checkIsUsernameUnique|catch:', error)
                    const axiosError = error as AxiosError<APIResponse>
                    // if (axiosError.response?.data.data) {
                    // setUsernameMessage(axiosError.response?.data.data[0].message ?? '')
                    setUsernameMessage(axiosError.response?.data.data.username ?? 'Error checking username.')
                    // } else {
                    // setUsernameMessage("Error checking username.")
                    // }
                } finally {
                    setCheckingUsername(false)
                }
            }
        }
        checkIsUsernameUnique()
    }, [username])

    const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
        setSubmittingForm(true)
        try {
            // console.log('createaccount onsubmit data: ',data)
            const response = await axios.post<APIResponse>(`/api/createAccount`, {
                username:data.username,
                email:data.email,
                redirectURL: `${process.env.NEXT_PUBLIC_BASE_URL}/verify/${data.username}`,
                password:data.password
            })
            if (response.data.success) {
                // console.log(response)
                toast({
                    title: response.data.message,
                })
                router.replace(`/verify/${data.username}`)
            } else {
                toast({
                    title: "Failed to create account",
                    description: "Unable to create account, please try again later.",
                    variant: "destructive"
                })
            }
        } catch (error) {
            const axiosError = error as AxiosError<APIResponse>
            toast({
                title: "Failed to create account",
                description: axiosError.response?.data.message ?? "Unable to create account, please try again later.",
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
                    <h1 className="text-xl font-extrabold tracking-tight lg:text-4xl mb-6">
                        OthersViewOnYou
                    </h1>
                    <h2 className="text-xl font-bold tracking-tight lg:text-2xl mb-6">
                        Create Account
                    </h2>


                </div>
                <Form {...signUpForm}>
                    <form onSubmit={signUpForm.handleSubmit(onSubmit)} className="space-y-6">
                        {/* Username input */}
                        <FormField
                            control={signUpForm.control}
                            name="username"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Username</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Choose a username" {...field}
                                            onChange={(e) => {
                                                field.onChange(e)
                                                debouncedUsername(e.target.value)
                                            }}
                                        />
                                    </FormControl>
                                    {/* <FormDescription>
                                        This is your public display name.
                                    </FormDescription> */}
                                    {chekingUsername && <Loader2 className="animate-spin" />}
                                    {!chekingUsername && usernameMessage &&
                                        <p className={`text-sm ${usernameMessage === 'User name is available.' ? 'text-green-500' : 'text-red-500'}`}>
                                            {usernameMessage}
                                        </p>
                                    }
                                    {/* <p>{usernameMessage}</p> */}
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        {/* Email input */}
                        <FormField
                            control={signUpForm.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Email" {...field} />
                                    </FormControl>
                                    <FormDescription>
                                        Verification code will be sent on this email.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        {/* Password input */}
                        <FormField
                            control={signUpForm.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <Input type="password" {...field} placeholder="Password" />
                                    </FormControl>
                                    {/* <FormDescription>
                                        This is your public display name.
                                    </FormDescription> */}
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit" className='w-full'>
                            {
                                submittingForm ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Please wait
                                    </>
                                ) : (
                                    'Create Account'
                                )
                            }
                        </Button>
                    </form>
                </Form>
                <div className="text-center mt-4">
                    <p>
                        Already a member?{' '}
                        <Link href="/sign-in" className="text-blue-600 hover:text-blue-800">
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}


