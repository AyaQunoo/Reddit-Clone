import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { errorHandelr } from "@/utils/handler";
import { subredditSchema } from "@validators/subredditSchema";
import createHttpError from "http-errors";

export async function POST(request: Request) {
  try {
    const session = await getAuthSession();
    if (!session?.user) {
      throw new createHttpError.Unauthorized(`unauthorized`);
    }
    const body = await request.json();
    const { name } = await subredditSchema.validate(body);
    const subredditExists = await db.subreddit.findFirst({
      where: {
        name,
      },
    });
    if (subredditExists) {
      throw new createHttpError[409](`subreddit already exists!`);
    }
    const subreddit = await db.subreddit.create({
      data: {
        name: name!,
        creatorId: session.user.id,
      },
    });
    await db.subscription.create({
      data: {
        userId: session.user.id,
        subredditId: subreddit.id,
      },
    });
    return new Response(subreddit.name);
  } catch (error: any) {
    return errorHandelr(error);
  }
}
