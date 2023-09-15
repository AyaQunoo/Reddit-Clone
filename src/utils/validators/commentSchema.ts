import { object, string } from "yup";
import * as yup from "yup";
export const commentSchema = object().shape({
  postId: string(),
  text: string(),
  replyToId: string().optional(),
});
export type CommentRequest = yup.InferType<typeof commentSchema>;
