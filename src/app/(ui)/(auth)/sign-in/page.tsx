'use client';

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { signInSchema } from "@/schemas/signInSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { signIn } from 'next-auth/react';
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import Link from "next/link";


export default function SignInPage() {
    const [submittingForm, setSubmittingForm] = useState(false)
    const { toast } = useToast()
    const router = useRouter()
    const signInForm = useForm<z.infer<typeof signInSchema>>({
        defaultValues: {
            identifier: '',
            password: ''
        },
        resolver: zodResolver(signInSchema)
    })

    const onSubmit = async (data: z.infer<typeof signInSchema>) => {
        setSubmittingForm(true)
        try {
            const result = await signIn('credentials', {
                redirect: false,
                identifier: data.identifier,
                password: data.password,
            });
            //   console.log('onSubmit: ', result)

            if (result?.error) {
                if (result.error === 'CredentialsSignin') {
                    toast({
                        title: 'Login Failed',
                        description: 'Incorrect username or password',
                        variant: 'destructive',
                    });
                } else {
                    toast({
                        title: 'Error',
                        description: result.error,
                        variant: 'destructive',
                    });
                }
            }

            if (result?.ok) {
                router.replace('/dashboard');
            }
        } catch (error) {
            toast({
                title: 'Error',
                description: 'Error in SignIn, please try after sometime',
                variant: 'destructive',
            });
        }
        finally {
            setSubmittingForm(false)
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
                        SignIn to your account
                    </h2>
                </div>
                <Form {...signInForm}>
                    <form className="space-y-6" onSubmit={signInForm.handleSubmit(onSubmit)}>
                        <FormField
                            control={signInForm.control}
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
                        <FormField
                            control={signInForm.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Password" type="password" {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                    <div className="text-right mt-4">
                                        <Link href="/reset" className="text-blue-600 hover:text-blue-800">
                                            Forget password?
                                        </Link>
                                    </div>
                                </FormItem>
                            )}
                        />
                        <Button disabled={submittingForm} type="submit" className='w-full'>
                            {
                                submittingForm ? (<Loader2 className="animate-spin" />) : 'Sign In'
                            }
                        </Button>
                    </form>
                </Form>
                <div className="text-center mt-4">
                    <p>
                        Don't have account?{' '}
                        <Link href="/sign-up" className="text-blue-600 hover:text-blue-800">
                            Create account
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}