
export interface ErrorResponse {
  error: {
    message: string | string[];
    err?: any;
  };
  status?: number;
}
export interface EmailData {
  name:string;
  email: string;
  emailType: EmailType;
  userId: string;
}
export enum EmailType {
  VERIFY = "VERIFY",
  RESET = "RESET",
}