import { object, string } from "yup";
import * as yup from "yup";
export const usernameSchema = object().shape({
  name: string().min(3).max(32),
});
export type usernameRequest = yup.InferType<typeof usernameSchema>;
