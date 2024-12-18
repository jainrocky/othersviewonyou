'use client';

import { Sheet, SheetTrigger, SheetContent, SheetTitle, SheetClose } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { LogOut, LogOutIcon } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"


export default function NavBar() {
    const { data: session } = useSession()
    const user = session?.user


    return (
        <header className="flex h-20 w-full shrink-0 items-center px-4 md:px-6 ">
            <Sheet>

                <SheetTrigger asChild>
                    <Button variant="outline" size="icon" className="lg:hidden">
                        <MenuIcon className="h-6 w-6" />
                        <span className="sr-only">Toggle navigation menu</span>
                    </Button>
                </SheetTrigger>

                <SheetContent side="left">
                    <SheetTitle>Menu</SheetTitle>

                    <div className="grid gap-2 py-6">
                        <SheetClose asChild>

                            <Link href="/" className="flex w-full items-center py-2 text-lg font-semibold" prefetch={false}>
                                Home
                            </Link>
                        </SheetClose>
                        <SheetClose asChild>
                            <Link href="/dashboard" className="flex w-full items-center py-2 text-lg font-semibold" prefetch={false}>
                                Dashboard
                            </Link>
                        </SheetClose>
                        {
                            session ? (
                                <SheetClose asChild>
                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <button onClick={() => signOut()}>
                                                    <LogOutIcon />
                                                </button>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p>Log Out</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                </SheetClose>
                            ) : (
                                <SheetClose asChild>
                                    <Link
                                        href="/sign-in"
                                        className="flex w-full items-center py-2 text-lg font-semibold"
                                        prefetch={false}
                                    >
                                        Sign In

                                    </Link></SheetClose>
                            )
                        }
                    </div>
                </SheetContent>
            </Sheet>
            <a href="/" className="text-xl font-bold m-4">OthersViewOnyou</a>
            <nav className="ml-auto hidden lg:flex gap-6">
                <Link
                    href="/"
                    className="group inline-flex h-9 w-max items-center justify-center rounded-md bg-white px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-100 hover:text-gray-900 focus:bg-gray-100 focus:text-gray-900 focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-gray-100/50 data-[state=open]:bg-gray-100/50 dark:bg-gray-950 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus:bg-gray-800 dark:focus:text-gray-50 dark:data-[active]:bg-gray-800/50 dark:data-[state=open]:bg-gray-800/50"
                    prefetch={false}
                >
                    Home
                </Link>
                <Link
                    href="/dashboard"
                    className="group inline-flex h-9 w-max items-center justify-center rounded-md bg-white px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-100 hover:text-gray-900 focus:bg-gray-100 focus:text-gray-900 focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-gray-100/50 data-[state=open]:bg-gray-100/50 dark:bg-gray-950 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus:bg-gray-800 dark:focus:text-gray-50 dark:data-[active]:bg-gray-800/50 dark:data-[state=open]:bg-gray-800/50"
                    prefetch={false}
                >
                    Dashboard
                </Link>
                {/* <Link
                    href="#"
                    className="group inline-flex h-9 w-max items-center justify-center rounded-md bg-white px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-100 hover:text-gray-900 focus:bg-gray-100 focus:text-gray-900 focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-gray-100/50 data-[state=open]:bg-gray-100/50 dark:bg-gray-950 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus:bg-gray-800 dark:focus:text-gray-50 dark:data-[active]:bg-gray-800/50 dark:data-[state=open]:bg-gray-800/50"
                    prefetch={false}
                >
                    Services
                </Link> */}
                {
                    session ? (
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <button onClick={() => signOut()}>
                                        <LogOutIcon />
                                    </button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Log Out</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    ) : (<>
                        <Link
                            href="/sign-in"
                            className="group inline-flex h-9 w-max items-center justify-center rounded-md bg-white px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-100 hover:text-gray-900 focus:bg-gray-100 focus:text-gray-900 focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-gray-100/50 data-[state=open]:bg-gray-100/50 dark:bg-gray-950 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus:bg-gray-800 dark:focus:text-gray-50 dark:data-[active]:bg-gray-800/50 dark:data-[state=open]:bg-gray-800/50"
                            prefetch={false}
                        >
                            Sign In

                        </Link>
                    </>)
                }


            </nav>
        </header>
    )
}

function MenuIcon(props:any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <line x1="4" x2="20" y1="12" y2="12" />
            <line x1="4" x2="20" y1="6" y2="6" />
            <line x1="4" x2="20" y1="18" y2="18" />
        </svg>
    )
}
