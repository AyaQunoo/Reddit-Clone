import { db } from "@/lib/db";
import { EmailType } from "@/types/api";
import { sendEmail } from "@/utils/email/mailer";
import { errorHandelr } from "@/utils/handler";
import createHttpError from "http-errors";
import { NextRequest,NextResponse } from "next/server";

export async function POST(request: NextRequest) {

try{

    const body =await request.json()
    const {email} =body;
    const user = await db.user.findUnique({
        where:{
            email
        }
    
    })
    if(!user){
        throw new createHttpError.NotFound(`user not found!`);
    }
    await sendEmail({email,emailType: EmailType.RESET,userId:user.id,name:user.name!})
    return NextResponse.json({
        message:"Email sent successfully"
    })
}catch(error:any){

    return errorHandelr(error);
}










}