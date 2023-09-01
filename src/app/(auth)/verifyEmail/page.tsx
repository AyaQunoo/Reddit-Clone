"use client";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
const VerifyEmail = () => {
    const router = useRouter();
    const [token, setToken] = useState('')
    const [verified, setVerified] = useState(false)

    const verifyUserEmail = async () => {
        try {
            await axios.post('/api/verifyEmail', { token });
            setVerified(true)
            router.push("/");
        } catch (error) {
            console.log(error);

        }
    }
    useEffect(() => {
        const urlToken = window.location.search.split('=')[1]
        setToken(urlToken)
    }, [])
    useEffect(() => {
        if (token.length > 0) {
            verifyUserEmail();
        }
    }, [token]);
    return (
        <div className="flex flex-col items-center justify-center min-h-screen py-2">

            <h1 className="text-4xl">Verify Email</h1>
            {verified && (
                <div>
                    <h2 className="text-2xl">Email has been Verified successfully</h2>
                    <Link href="/sign-in">
                        Login
                    </Link>
        
                </div>
            )}
        </div>
    )


}
export default VerifyEmail