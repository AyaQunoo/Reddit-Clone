import createHttpError from "http-errors";
import { NextResponse} from "next/server";
import { ValidationError } from "yup";

export function errorHandelr(error: Error) {
  if (createHttpError.isHttpError(error) && error.expose) {
   return new NextResponse(
        JSON.stringify({
            error: {
              message: error.message,
            },
            status: error.statusCode
          }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      )
  } else if (error instanceof ValidationError) {
    return new NextResponse(
        JSON.stringify({
            error: {
              message: error.errors,
            },
            status:400
          }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      )
  } else {
    return new NextResponse(JSON.stringify({
      error: {
        message: "internal server error",
      }}),
      {status: createHttpError.isHttpError(error) ? error.statusCode : 500},
    );
  }
}

