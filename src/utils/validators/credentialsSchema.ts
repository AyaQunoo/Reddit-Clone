import {object,string,ref} from 'yup'
export const credentialsSchema = object().shape({
    email: string().email().required(),
    password:string().required(),
  });
export const resetPasswordSchema =object().shape({
  password: string()
  .min(7, "Password must be at least 7 characters")
  .matches(
    /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*()_+])[a-zA-Z0-9!@#$%^&*()_+]+$/,
    "Password must contain at least one letter, one digit, and one special character"
  ),
  confirmPassword:string()
    .oneOf([ref('password'), undefined], 'Passwords must match') 
})