import { object, string } from "yup";
export const registerSchema = object().shape({
  email: string().required("Email is required").email("Invalid email"),
  name: string().required("Username is required").max(20),
  password: string()
    .required("Password is required")
    .min(7, "Password must be at least 7 characters")
    .matches(
      /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*()_+])[a-zA-Z0-9!@#$%^&*()_+]+$/,
      "Password must contain at least one letter, one digit, and one special character"
    ),
});
