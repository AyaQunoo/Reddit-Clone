'use client'
import React from 'react';
import { Icons } from './Icons';
import Link from 'next/link';
import UserAuthForm from './UserAuthForm';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { yupResolver as resolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { registerSchema } from '@validators/registerSchema';
import { useToast } from "@/hooks/use-toast";
import { useRouter } from 'next/navigation';
type FormData = yup.InferType<typeof registerSchema>;
const Register = () => {
    const { toast } = useToast();
    const router = useRouter();
    const { register, handleSubmit, formState: { errors }, setError } = useForm<FormData>({
        resolver: resolver(registerSchema),
        mode: 'onChange',
    });


    const registeredUser = async (data: FormData) => {
        try {
            const response = await axios.post('/api/register', data)
            if (response.status === 200) {
                toast({
                    title: '',
                    description: 'Account has been created successfully!,please check your email to verify your account ',
                    variant: 'default'
                })
                router.replace('/sign-in')
            }

        } catch (error: any) {
            const backendErrors = error.response.data.error.message;
            setError("email", {
                type: 'manual',
                message: backendErrors,
            });

        }

    }
    return (
        <div className='container mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[400px]'>
            <div className='flex flex-col space-y-2 text-center'>
                <Icons.logo className="mx-auto h-6 w-6" />
                <h1 className='text-2xl font-semibold tracking-tight'>Sign Up</h1>
                <p className='text-sm max-w-xs mx-auto'>
                    By continuing, you are setting up a breadit account and agree to our User Agreement and Privacy Policy
                </p>
                <div className=" flex flex-col gap-4 text-sm">

                    <form onSubmit={handleSubmit(registeredUser)} className="space-y-6">
                        <div>
                            <input
                                {...register('email')}
                                className="border border-gray-400 focus:outline-slate-400 rounded-md w-full shadow-sm px-5 py-2"
                                type="email"
                                placeholder="Email"
                            />
                            {errors.email && <p className="text-red-500">{errors.email.message}</p>}
                        </div>
                        <div>
                            <input
                                {...register('name')}
                                className="border border-gray-400 focus:outline-slate-400 rounded-md w-full shadow-sm px-5 py-2"
                                type="text"
                                placeholder="Username"
                            />
                            {errors.name && <p className="text-red-500">{errors.name.message}</p>}
                        </div>
                        <div>
                            <input
                                {...register('password')}
                                className="border border-gray-400 focus:outline-slate-400 rounded-md w-full shadow-sm px-5 py-2"
                                type="password"
                                placeholder="Password"
                            />
                            {errors.password && <p className="text-red-500">{errors.password.message}</p>}
                        </div>
                        <div>
                            <input
                                className="bg-[#4F46E5] w-full py-2 rounded-md text-white font-bold cursor-pointer hover:bg-[#181196]"
                                type="submit"
                                value="Register"
                            />
                        </div>
                    </form>

                </div>
                <UserAuthForm />

                {/* sign in form  */}
                <p className='px-8 text-center text-sm text-zinc-700'>
                    Already a redditor?{' '}
                    <Link href={'/sign-in'} className='hover:text-zinc-800 text-sm underline underline-offset-4'>log in</Link>
                </p>

            </div>
        </div>
    )
}
export default Register


