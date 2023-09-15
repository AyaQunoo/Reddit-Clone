import { getAuthSession } from "@/lib/auth";
import createHttpError from "http-errors";
import { subredditSubscriptionSchema } from "@validators/subredditSchema";
import { db } from "@/lib/db";
import { errorHandelr } from "@/utils/handler";
export async function POST(request: Request) {
  try {
    const session = await getAuthSession();
    if (!session?.user) {
      throw new createHttpError.Unauthorized(`unauthorized`);
    }
    const body = await request.json();
    const { subredditId } = await subredditSubscriptionSchema.validate(body);
    const subscriptionExists = await db.subscription.findFirst({
      where: {
        subredditId,
        userId: session.user.id,
      },
    });
    if (subscriptionExists) {
      throw new createHttpError[400](
        `you are already subscribed to this subreddit`
      );
    }
    await db.subscription.create({
      data:{
        subredditId:subredditId!,
        userId:session.user.id
     
    }})
    return new Response(subredditId)
  } catch (error: any) {
  return  errorHandelr(error)
  }
}
