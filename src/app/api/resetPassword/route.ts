import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import createHttpError from "http-errors";
import { errorHandelr } from "@/utils/handler";
import bcrypt from "bcrypt";
import { resetPasswordSchema } from "@validators/credentialsSchema";
export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { token } = reqBody;
    const {  password } = await resetPasswordSchema.validate(reqBody);
    const user = await db.user.findFirst({
      where: {
        AND: [
          {
            forgotPasswordToken: {
              equals: token,
            },
          },
          {
            forgotPasswordTokenExpiry: {
              gt: new Date(Date.now()),
            },
          },
        ],
      },
      select: {
        id: true,
      },
    });

    if (!user) {
      throw new createHttpError.NotFound(`invaild token!`);
    }
    const hashedPassword = await bcrypt.hash(password!, 10);
    await db.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        forgotPasswordToken: null,
        verifyTokenExpiry: null,
      },
    });
    return NextResponse.json({
      message: "password reset successfully",
      status: 200,
    });
  } catch (error: any) {
    return errorHandelr(error);
  }
}
