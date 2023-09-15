import bcrypt from "bcrypt";
import { db } from "@/lib/db";
import { EmailType } from "@/types/api";
import { NextRequest, NextResponse } from "next/server";
import createHttpError from "http-errors";
import { registerSchema } from "@validators/registerSchema";
import { errorHandelr } from "@/utils/handler";
import jwt from "jsonwebtoken";
import { sendEmail } from "@/utils/email/mailer";
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, name } = await registerSchema.validate(body);
  

    const exist = await db.user.findUnique({
      where: {
        email,
      },
    });
    if (exist) {
      throw new createHttpError.NotFound(`email already exists!`);
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await db.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });
    const token = jwt.sign(
      {
        name: user.name,
        id: user.id,
        email: user.email,
      },
      process.env.TOKEN_SECRET!
    );
    await sendEmail({
      email,
      emailType: EmailType.VERIFY,
      userId: user.id,
      name: user.name!,
    });
    const response = new NextResponse(
      JSON.stringify({ message: "User created successfully", data: user }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
    response.cookies.set("token", token);
    return response;
  } catch (error: any) {
    return errorHandelr(error);
  }
}
