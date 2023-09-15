import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { errorHandelr } from "@/utils/handler";
import { commentSchema } from "@/utils/validators/commentSchema";
import createHttpError from "http-errors";

export async function PATCH(req: Request) {
  try {
    const body = await req.json();

    const { replyToId, text, postId } = await commentSchema.validate(body);
    const session = await getAuthSession();
    if (!session?.user) {
      throw new createHttpError.Unauthorized(`unauthorized`);
    }
    await db.comment.create({
      data: {
        text: text!,
        postId: postId!,
        authorId: session.user.id,
        replyToId,
      },
    });
    return new Response("ok");
  } catch (error: any) {
    return errorHandelr(error);
  }
}
