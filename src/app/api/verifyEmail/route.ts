import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import createHttpError from "http-errors";
import { errorHandelr } from "@/utils/handler";
export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { token } = reqBody;
    const user = await db.user.findFirst({
      where: {
        AND: [
            {
              verifyToken: {
                    equals: token
                }
            },
            {
              verifyTokenExpiry: {
                    gt: new Date(Date.now())
                }
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
    await db.user.update({
      where: { id: user.id },
      data: {
        isVerified: true,
        verifyToken: null,
        verifyTokenExpiry: null,
      },
    });
    return NextResponse.json({
      message: "Email verified successfully",
      status: 200,
    });
  } catch (error: any) {
    console.log(error);
    
    return errorHandelr(error);
  }
}
