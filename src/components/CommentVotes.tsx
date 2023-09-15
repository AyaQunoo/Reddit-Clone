'use client'

import { useCustomToast } from "@/hooks/use-custom-toast";
import { usePrevious } from "@mantine/hooks";
import { CommentVote, VoteType } from "@prisma/client";
import { FC, useState } from "react";
import { Button } from "@components/ui/Button";
import { ArrowBigDown, ArrowBigUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { toast } from "@/hooks/use-toast";
import { CommentVoteRequest } from "@/utils/validators/voteSchema";

interface CommentVoteProps {
    commentId: string
    initialVotesAmt: number
    initialVote?: Pick<CommentVote, 'type'>
}

const CommentVote: FC<CommentVoteProps> = ({
    commentId,
    initialVotesAmt,
    initialVote
}) => {
    const { loginToast } = useCustomToast()
    const [votesAmt, setVotesAmt] = useState<number>(initialVotesAmt)
    const [currentVote, setcurrentVote] = useState(initialVote)
    const preVote = usePrevious(currentVote)

    const { mutate: vote } = useMutation({
        mutationFn: async (voteType: VoteType) => {
            const payload: CommentVoteRequest = {
                commentId,
                voteType,

            }
            await axios.patch('/api/subreddit/post/comment/vote', payload)

        },
        onError: (error, voteType) => {
    

            if (voteType === 'UP') {
                setVotesAmt((prev) => prev - 1)

            } else {
                setVotesAmt((prev) => prev + 1)
            }
            setcurrentVote(preVote)
            if (error instanceof AxiosError) {
                if (error.response?.status === 401) {
                    return loginToast()
                }
            }
            return toast({
                title: 'something went wrong',
                description: 'your vote doesnt registerd try again later',
                variant: 'destructive'
            })

        },
        onMutate: (type) => {
            if (currentVote?.type === type) {
                setcurrentVote(undefined)
                if (type === 'UP') setVotesAmt((prev) => prev - 1)
                else if (type === 'DOWN') setVotesAmt((prev) => prev + 1)
            } else {
                setcurrentVote({ type })
                if (type === 'UP') setVotesAmt((prev) => prev + (currentVote ? 2 : 1))
                else if (type === 'DOWN')
                    setVotesAmt((prev) => prev - (currentVote ? 2 : 1))
            }
        },
    })
    return (<div className="flex gap-1">
        <Button onClick={() => vote('UP')} size='sm' variant={'ghost'} aria-label="upVote">
            <ArrowBigUp className={cn('h-5 w-5 text-zinc-700', {
                'text-emerald-500 fill-emerald-500': currentVote?.type === 'UP'
            })} />
        </Button>
        <p className="text-center py-2 font-medium text-sm text-zinc-900">{votesAmt}</p>
        <Button onClick={() => vote('DOWN')} size='sm' variant={'ghost'} aria-label="upVote">
            <ArrowBigDown className={cn('h-5 w-5 text-zinc-700', {
                'text-red-500 fill-red-500': currentVote?.type === 'DOWN'
            })} />
        </Button>
    </div>);
}

export default CommentVote;