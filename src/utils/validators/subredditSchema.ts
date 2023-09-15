import { object, string } from "yup";
import * as yup from "yup";
export const subredditSchema = object().shape({
  name: string().min(3).max(21),
});
export const subredditSubscriptionSchema = object().shape({
  subredditId: string(),
});

export type CreateSubredditPayload = yup.InferType<typeof subredditSchema>;
export type subredditSubscriptionPayload =yup.InferType<typeof subredditSubscriptionSchema>
