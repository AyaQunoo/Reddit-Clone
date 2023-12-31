import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { errorHandelr } from "@/utils/handler";
import { PostRenderSchema } from "@validators/postSchema";
export async function GET(req: Request) {
  const url = new URL(req.url);
  const session = await getAuthSession();

  let followedCommunitesIds: string[] = [];
  if (session) {
    const followedCommunites = await db.subscription.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        subreddit: true,
      },
    });
  
    followedCommunitesIds = followedCommunites.map(({ subreddit }) => {
      return subreddit.id;
    });
  }
  try {
    const { limit, page, subredditName } = await PostRenderSchema.validate({
      subredditName: url.searchParams.get("subredditName"),
      limit: url.searchParams.get("limit"),
      page: url.searchParams.get("page"),
    });
    let whereClause = {};
    if (subredditName) {
      whereClause = {
        subreddit: {
          name: subredditName,
        },
      };
    } else if (session) {
      whereClause = {
        subreddit: {
          id: {
            in: followedCommunitesIds,
          },
        },
      };
    }
    const posts = await db.post.findMany({
      take: parseInt(limit!),
      skip: (parseInt(page!) - 1) * parseInt(limit!),
      orderBy: {
        createdAt: "desc",
      },
      include: {
        subreddit: true,
        votes: true,
        author: true,
        comments: true,
      },
      where: whereClause,
    });
    return new Response(JSON.stringify(posts));
  } catch (error: any) {
    return errorHandelr(error);
  }
}
