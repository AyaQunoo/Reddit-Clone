'use client'

import { FC } from "react";
import { useForm } from "react-hook-form";
import { yupResolver as resolver } from '@hookform/resolvers/yup';
import { usernameRequest, usernameSchema } from "@/utils/validators/usernameSchema";
import { User } from "@prisma/client";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/Card";
import { Label } from "./ui/Label";
import { Input } from "./ui/Input";
import { Button } from "./ui/Button";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import * as yup from "yup";
interface UserNameFormProps {
    user: Pick<User, 'id' | 'username'>
}
type formData = yup.InferType<typeof usernameSchema>;
const UserNameForm: FC<UserNameFormProps> = ({ user }) => {
    const { handleSubmit, register, formState: { errors } } = useForm<formData>({
        resolver: resolver(usernameSchema),
        defaultValues: {
            name: user?.username || ''
        }
    })
    const router = useRouter()
    const { mutate: updateUsername, isLoading } = useMutation({
        mutationFn: async ({ name }: usernameRequest) => {
            const payload: usernameRequest = { name }
            const { data } = await axios.patch('/api/username', payload)
            return data
        },
        onError: (err) => {
            if (err instanceof AxiosError) {
                if (err.response?.status === 409) {
                    return toast({
                        title: 'Username already taken.',
                        description: 'Please choose another username.',
                        variant: 'destructive',
                    })
                }
            }

            return toast({
                title: 'Something went wrong.',
                description: 'Your username was not updated. Please try again.',
                variant: 'destructive',
            })
        },
        onSuccess: () => {
            toast({
                description: 'Your username has been updated.',
            })
            router.refresh()
        },
    })
    return (<form

        onSubmit={handleSubmit((e) => updateUsername(e))}
    >
        <Card>
            <CardHeader>
                <CardTitle>Your username</CardTitle>
                <CardDescription>
                    Please enter a display name you are comfortable with.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className='relative grid gap-1'>
                    <div className='absolute top-0 left-0 w-8 h-10 grid place-items-center'>
                        <span className='text-sm text-zinc-400'>u/</span>
                    </div>
                    <Label className='sr-only' htmlFor='name'>
                        Name
                    </Label>
                    <Input
                        id='name'
                        className='w-[400px] pl-6'
                        size={32}
                        {...register('name')}
                    />
                    {errors?.name && (
                        <p className='px-1 text-xs text-red-600'>{errors.name.message}</p>
                    )}
                </div>
            </CardContent>
            <CardFooter>
                <Button isLoading={isLoading}>Change name</Button>
            </CardFooter>
        </Card>
    </form>);
}

export default UserNameForm;