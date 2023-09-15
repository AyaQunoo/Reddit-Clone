import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { errorHandelr } from "@/utils/handler";
import { commentVoteSchema } from "@validators/voteSchema";
import createHttpError from "http-errors";
export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { commentId, voteType } = await commentVoteSchema.validate(body);

    const session = await getAuthSession();
    if (!session?.user) {
      throw new createHttpError.Unauthorized(`unauthorized`);
    }
    const existingVote = await db.commentVote.findFirst({
      where: {
        userId: session.user.id,
        commentId,
      },
    });

    if (existingVote) {
      if (existingVote.type === voteType) {
        await db.commentVote.delete({
          where: {
            userId_commentId: {
              commentId: commentId!,
              userId: session.user.id,
            },
          },
        });
        return new Response("OK");
      } else {
        await db.commentVote.update({
          where: {
            userId_commentId: {
              commentId: commentId!,
              userId: session.user.id,
            },
          },
          data: {
            type: voteType,
          },
        });
      }
      return new Response("okk");
    }

    await db.commentVote.create({
      data: {
        type: voteType!,
        userId: session.user.id,
        commentId: commentId!,
      },
    });
    return new Response("OK");
  } catch (error: any) {
    return errorHandelr(error);
  }
}
