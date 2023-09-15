'use client'

import { useState } from "react"
import { Input } from "@/components/ui/Input"
import { Button } from "@/components/ui/Button"
import { useRouter } from "next/navigation"
import { useMutation } from '@tanstack/react-query'
import { CreateSubredditPayload } from '@validators/subredditSchema'
import axios, { AxiosError } from "axios"
import { toast } from "@/hooks/use-toast"
import { useCustomToast } from "@/hooks/use-custom-toast"
const Page = () => {
    const [input, setInput] = useState<string>()
    const router = useRouter()
    const { loginToast } = useCustomToast()
    const { mutate: createCommunity, isLoading } = useMutation({
        mutationFn: async () => {
            // validate
            const payload: CreateSubredditPayload = {
                name: input

            }
            const { data } = await axios.post('/api/subreddit', payload)


            return data as string
        },
        onError: (error) => {
            if (error instanceof AxiosError) {
                if (error.response?.data.status === 409) {
                    return toast({
                        title: 'subreddit already exists',
                        description: "please choose a difrent subreddit name",
                        variant: 'destructive'
                    })
                }
                if (error.response?.data.status === 403) {
                    return toast({
                        title: 'invalid subreddit name',
                        description: "please choose a name between 3 and 21 charcter",
                        variant: 'destructive'
                    })
                }
                if (error.response?.data.status === 401) {
                    return loginToast()
                }

            }
            return toast({
                title: 'there was an error ',
                description: "couldnt create subreddit",
                variant: 'destructive'
            })

        },
        onSuccess:(data)=>{
            router.push(`/r/${data}`)
        }
    })
    return (
        <div className="container flex items-center h-full max-w-3xl mx-auto">
            <div className="relative bg-white w-full h-fit p-4 rounded-lg space-y-6">
                <div className="flex justify-between items-center">
                    <h1 className="text-xl font-semibold">create community</h1>

                </div>
                <hr className="bg-zinc-500 h-px" />
                <div>
                    <p className="text-lg font-medium">Name</p>
                    <p className="text-xs pb-2">community names including capitalization cannt be changed.</p>
                </div>
                <div className="relative">
                    <p className="absoute text-sm left-0 w-8 inset-y-0 grid place-items-center text-zinc-400 ">
                        r/
                    </p>
                    <Input type='text' value={input} onChange={(e) => setInput(e.target.value)
                    } className='pl-6' />

                </div>
                <div className="flex justify-end gap-4">
                    <Button variant={'subtle'} onClick={() => router.back()}>Cancle</Button>
                    <Button isLoading={isLoading} disabled={input?.length === 0} onClick={() => createCommunity()}>create community</Button>
                </div>
            </div>

        </div>
    )

}
export default Page