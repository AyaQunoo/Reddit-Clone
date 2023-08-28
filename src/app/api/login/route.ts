import bcrypt from "bcrypt";
import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import createHttpError from "http-errors";
import { credentialsSchema } from "@validators/credentialsSchema";
import { errorHandelr } from "@/utils/handler";
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = await credentialsSchema.validate(body);
    console.log(email, password);

    const user = await db.user.findUnique({
      where: {
        email,
      },
    });
    if (!user || !user?.password) {
      throw new createHttpError.NotFound("No user found");
    }
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      throw new createHttpError.NotAcceptable("email or password incorrect ");
    }
    return new NextResponse(
      JSON.stringify({ message: "Loged in  successfully", data: user }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error: any) {
    return errorHandelr(error);
  }
}
