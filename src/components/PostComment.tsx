'use client'
import { FC, useRef, useState } from "react";
import UserAvatar from "./UserAvatar";
import { CommentVote, User, Comment } from "@prisma/client";
import { formatTimeToNow } from "@/lib/utils";
import CommentVotes from "./CommentVotes";
import { Button } from "./ui/Button";
import { MessageSquare } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Label } from "./ui/Label";
import { TextArea } from "./ui/TextArea";
import { useMutation } from "@tanstack/react-query";
import { CommentRequest } from "@/utils/validators/commentSchema";
import axios from "axios";
import { toast } from "@/hooks/use-toast";

type ExtendedComment = Comment & {
    votes: CommentVote[]
    author: User
}
interface PostCommentProps {
    comment: ExtendedComment,
    votesAmt: number,
    currentVote: CommentVote | undefined,
    postId: string
}

const PostComment: FC<PostCommentProps> = ({
    comment,
    votesAmt,
    currentVote,
    postId
}) => {
    const commentRef = useRef<HTMLDivElement>(null)
    const router = useRouter()
    const { data: session } = useSession()
    const [isReplying, setIsReplying] = useState<boolean>()
    const [input, setInput] = useState<string>()
    const { mutate: postComment } = useMutation({
        mutationFn: async ({ postId, text, replyToId }: CommentRequest) => {
            const payload: CommentRequest = {
                postId,
                text,
                replyToId
            }
            const { data } = await axios.patch(`/api/subreddit/post/comment`, payload)
            return data
        }, onError: () => {
            return toast({
                title: 'something went wrong',
                description: 'comment wasnt posterd ,try again',
                variant: 'destructive'
            })
        },
        onSuccess: () => {
            router.refresh()
            setIsReplying(false)
        }
    })
    return (<div className="flex flex-col" ref={commentRef}>
        <div className="flex items-center">
            <UserAvatar user={{
                name: comment.author.name || null,
                image: comment.author.image || null
            }} className="h-6 w-6" />
            <div className="ml-2 flex flex-center gap-x-2">
                <p className="text-sm font-medium text-gray-900">u/{comment.author.username}</p>
                <p className="max-h-40 truncate text-xs text-zinc-500">
                    {formatTimeToNow(new Date(comment.createdAt))}
                </p>
            </div>


        </div>
        <p className="text-sm text-zinc-900 mt-2">{comment.text}</p>
        <div className="flex gap-2 items-center flex-wrap">
            <CommentVotes commentId={comment.id} initialVotesAmt={votesAmt} initialVote={currentVote} />
            <Button variant={'ghost'} size={'xs'} aria-label="reply" onClick={() => {
                if (!session) return router.push('/sign-in')
                setIsReplying(true)
            }}>
                <MessageSquare className="h-4 w-4 mr-1.5" />
                Reply</Button>
            {isReplying ? (
                <div className="grid w-full gap-1.5">
                    <Label>your comment</Label>
                    <div className="mt-2">
                        <TextArea id='comment' value={input} onChange={(e) => setInput(e.target.value)} rows={1} placeholder="what are your thougths" />
                        <div className="mt-2 flex justify-end gap-2">
                            <Button tabIndex={-1} variant={'subtle'} onClick={() => setIsReplying(false)}>Cancel</Button>
                            <Button disabled={input?.length === 0}
                                onClick={() => {
                                    if (!input) return
                                    postComment({ postId, text: input, replyToId: comment.replyToId ?? comment.id })
                                }

                                }>Post</Button>
                        </div>
                    </div>
                </div>
            ) : null}
        </div>
    </div>);
}

export default PostComment;