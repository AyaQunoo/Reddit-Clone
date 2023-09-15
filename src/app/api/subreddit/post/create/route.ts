import { getAuthSession } from "@/lib/auth";
import createHttpError from "http-errors";
import { PostSchema } from "@validators/postSchema";
import { db } from "@/lib/db";
import { errorHandelr } from "@/utils/handler";
export async function POST(request: Request) {
  try {
    const session = await getAuthSession();
    if (!session?.user) {
      throw new createHttpError.Unauthorized(`unauthorized`);
    }
    const body = await request.json();
    const { subredditId, title, content } = await PostSchema.validate(body);
    const subscriptionExists = await db.subscription.findFirst({
      where: {
        subredditId,
        userId: session.user.id,
      },
    });
    if (!subscriptionExists) {
      throw new createHttpError[400]("subscribe to post ");
    }
    await db.post.create({
      data: {
        subredditId: subredditId!,
        title: title!,
        content,
        authorId: session.user.id,
      },
    });
    return new Response("okkay");
  } catch (error: any) {
    return errorHandelr(error);
  }
}
