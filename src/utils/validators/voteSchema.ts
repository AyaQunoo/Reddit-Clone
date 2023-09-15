import { VoteType } from "@prisma/client";
import { object, string } from "yup";
import * as yup from "yup";
export const voteSchema = object().shape({
  postId: string(),
  voteType: string<VoteType>().oneOf(["UP", "DOWN"]),
});
export type PostVoteRequest = yup.InferType<typeof voteSchema>;
export const commentVoteSchema = object().shape({
  commentId: string(),
  voteType: string<VoteType>().oneOf(["UP", "DOWN"]),
});
export type CommentVoteRequest = yup.InferType<typeof commentVoteSchema>;
