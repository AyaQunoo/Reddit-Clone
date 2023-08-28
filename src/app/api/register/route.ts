import bcrypt from "bcrypt";
import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import createHttpError from "http-errors";
import { registerSchema } from "@validators/registerSchema";
import { errorHandelr } from "@/utils/handler";
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
    return new NextResponse(
      JSON.stringify({ message: "User created successfully", data: user }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
    
  } catch (error: any) {
    return errorHandelr(error);
  }
}
