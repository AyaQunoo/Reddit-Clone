"use client";

import axios from "axios";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from 'react-hook-form';
import { yupResolver as resolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { resetPasswordSchema } from '@validators/credentialsSchema';
type FormData = yup.InferType<typeof resetPasswordSchema>;
export default function ResetPassword() {
    const { register, handleSubmit, formState: { errors }, setError } = useForm<FormData>({
        resolver: resolver(resetPasswordSchema),
        mode: 'onChange',
    });
    const router = useRouter();
    const [token, setToken] = useState("");
    const resetPassword = async (data: FormData) => {
        try {
            await axios.post("/api/resetPassword", {
                token,
                ...data,
            });
            router.push("/sign-in");
        } catch (error: any) {
            console.log(error);

        }
    };

    useEffect(() => {
        const urlToken = window.location.search.split("=")[1];
        setToken(urlToken || "");
    }, []);

    return (
        <div className="min-h-screen  flex flex-col py-12 sm:px-6 lg:px-8">
            <form onSubmit={handleSubmit(resetPassword)} className="sm:mx-auto sm:w-full sm:max-w-md shadow-md rounded-md bg-white p-6">
                <h2 className="mt-2 text-blue-900 text-center text-2xl font-bold text-gray-900">
                    Reset Password
                </h2>
                <div className="mb-6 mt-6">
                    <input
                        {...register('password')}
                        className="text-black w-full py-2 px-4 border border-gray-300 rounded"
                        type="password"
                        id="password"
                        placeholder="Enter your new password"
                        required
                    />
                    {errors.password && <p className="text-red-500">{errors.password.message}</p>}
                </div>
                <div className="mb-6">
                    <input
                        className="text-black w-full py-2 px-4 border border-gray-300 rounded"
                        type="password"
                        id="confirmPassword"
                        placeholder="Confirm your new password"
                        required
                    />
                    {errors.confirmPassword && <p className="text-red-500">{errors.confirmPassword.message}</p>}
                </div>
                <input
                    className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
                    type="submit"
                    value={"Reset"}
                />


            </form>
        </div>
    );
}