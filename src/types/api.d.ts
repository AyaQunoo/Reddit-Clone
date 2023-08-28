
export interface ErrorResponse {
  error: {
    message: string | string[];
    err?: any;
  };
  status?: number;
}
