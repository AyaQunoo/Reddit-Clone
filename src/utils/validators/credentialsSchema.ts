import {object,string} from 'yup'
export const credentialsSchema = object().shape({
    email: string().email().required(),
    password:string().required(),
  });