'use client'
import { FC, startTransition } from "react";
import { Button } from "./ui/Button";
import { useMutation } from "@tanstack/react-query";
import { subredditSubscriptionPayload } from "@/utils/validators/subredditSchema";
import axios, { AxiosError } from "axios";
import { useCustomToast } from "@/hooks/use-custom-toast"
import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
interface SubscribeLeaveToggleProps {
    subredditId: string,
    subredditName:string,
    isSubscribed:boolean
}

const SubscribeLeaveToggle: FC<SubscribeLeaveToggleProps> = ({ subredditId ,subredditName,isSubscribed}) => {
    const { loginToast } = useCustomToast()
    const router = useRouter()
    const { mutate:subscribe ,isLoading:isSubloading} = useMutation({
        mutationFn: async () => {
            const payload: subredditSubscriptionPayload = {
                subredditId,

            }
            const { data } = await axios.post('/api/subreddit/subscribe', payload)
            return data as string
        },
        onError: (error) => {
            if (error instanceof AxiosError) {
                if (error.response?.status === 401) {
                    return loginToast()
                }
            }
            return toast({
                title: 'there was an error ',
                description: "sth wentwrong please try again",
                variant: 'destructive'
            })
        }
        , onSuccess: () => {
            startTransition(() => {
                router.refresh();
            })
            return toast({
                title: 'subscribed ',
                description: `You are now subscribed to r/${subredditName}`,
            })
        }
    })
    const { mutate:unsubscribe ,isLoading:isUnSubloading} = useMutation({
        mutationFn: async () => {
            const payload: subredditSubscriptionPayload = {
                subredditId,

            }
            const { data } = await axios.post('/api/subreddit/unSubscribe', payload)
            return data as string
        },
        onError: (error) => {
            if (error instanceof AxiosError) {
                if (error.response?.status === 401) {
                    return loginToast()
                }
            }
            return toast({
                title: 'there was an error ',
                description: "sth wentwrong please try again",
                variant: 'destructive'
            })
        }
        , onSuccess: () => {
            startTransition(() => {
                router.refresh();
            })
            return toast({
                title: 'unsubscribed ',
                description: `You are now unsubscribed from r/${subredditName}`,
            })
        }
    })

    return isSubscribed ? (<Button className="w-full mt-1 mb-4"  onClick={()=>unsubscribe()} isLoading={isUnSubloading}>Leave community</Button>) : (<Button className="w-full mt-1 mb-4" isLoading={isSubloading} onClick={()=>subscribe()}>join to post</Button>);
}

export default SubscribeLeaveToggle;


