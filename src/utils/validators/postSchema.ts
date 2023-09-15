import * as yup from "yup";
import { mixed, object, string } from "yup";
export const PostSchema = object().shape({
  title: string()
    .min(3, { message: "title should be longer than 3 charchters " })
    .max(128, { message: "title must be at least 128 charchter" }),
  subredditId: string(),
  content: mixed(),
});
export const PostRenderSchema = object().shape({
  limit: string(),
  page: string(),
  subredditName: string().optional().nullable(),
});
export type PostCreationRequest = yup.InferType<typeof PostSchema>;
