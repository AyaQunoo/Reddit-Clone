'use client'
import { FC, useState } from "react";
import { Label } from "./ui/Label";
import { TextArea } from "./ui/TextArea";
import { Button } from "./ui/Button";
import { useMutation } from "@tanstack/react-query";
import { CommentRequest } from "@/utils/validators/commentSchema";
import axios, { AxiosError } from "axios";
import { toast } from "@/hooks/use-toast";
import { useCustomToast } from "@/hooks/use-custom-toast";
import { useRouter } from "next/navigation";

interface CreateCommentProps {
    postId: string
    replyToId?: string
}

const CreateComment: FC<CreateCommentProps> = ({ postId, replyToId }) => {
    const [input, setInput] = useState<string>('')
    const { loginToast } = useCustomToast()
    const router = useRouter()
    const { mutate: comment, isLoading } = useMutation({
        mutationFn: async ({ postId,
            text,
            replyToId }: CommentRequest) => {
            const payload: CommentRequest = {
                postId,
                text,
                replyToId
            }
            const { data } = await axios.patch('/api/subreddit/post/comment', payload)
            return data
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
        },
        onSuccess: () => {
            router.refresh()
            setInput('')
        }
    })
    return (<div className="grid w-full gap-1.5">
        <Label htmlFor="comment">your comment</Label>
        <div className="mt-2">

            <TextArea id='comment' value={input} onChange={(e) => setInput(e.target.value)} rows={1} placeholder="what are your thougths" />
            <div className="mt-2 flex justify-end">
                <Button isLoading={isLoading} disabled={input.length === 0} onClick={() => comment({ postId, text: input, replyToId })}>Post</Button>
            </div>
        </div>
    </div>);
}

export default CreateComment;