import nodemailer from "nodemailer";
import { db } from "@/lib/db";
import bcrypt from "bcrypt";
import { EmailData, EmailType } from "../../types/api";
import { generateEmailHtml } from "./buildmail";
export const sendEmail = async ({
  email,
  emailType,
  userId,
  name,
}: EmailData) => {
  try {
    const hashedToken = await bcrypt.hash(userId, 10);
    if (emailType === EmailType.VERIFY) {
      await db.user.update({
        where: { id: userId },
        data: {
          verifyToken: hashedToken,
          verifyTokenExpiry: new Date(Date.now() + 3600000),
        },
      });
    } else if (emailType === EmailType.RESET) {
      await db.user.update({
        where: { id: userId },
        data: {
          forgotPasswordToken: hashedToken,
          forgotPasswordTokenExpiry: new Date(Date.now() + 3600000),
        },
      });
    }
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.USER,
        pass: process.env.PASSWORD,
      },
    });

    const html = generateEmailHtml(name, hashedToken, emailType);
    const mailOptions = {
      from: process.env.USER,
      to: email,
      subject:
        emailType === EmailType.VERIFY
          ? "verify your email"
          : "reset your password",
      html: html,
    };
    const mailresponse = await transporter.sendMail(mailOptions);
    return mailresponse;
  } catch (error: any) {
    console.log(error);
  }
};
