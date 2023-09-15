import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { redis } from "@/lib/redis";
import { CachedPost } from "@/types/redis";
import { errorHandelr } from "@/utils/handler";
import { voteSchema } from "@validators/voteSchema";
import createHttpError from "http-errors";
const CACHE_AFTER_UPVOTES = 1;
export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { postId, voteType } = await voteSchema.validate(body);


    const session = await getAuthSession();
    if (!session?.user) {
      throw new createHttpError.Unauthorized(`unauthorized`);
    }
    const existingVote = await db.vote.findFirst({
      where: {
        userId: session.user.id,
        postId,
      },
    });
  
    
    const post = await db.post.findUnique({
      where: {
        id: postId,
      },
      include: {
        author: true,
        votes: true,
      },
    });
    if (!post) {
      throw new createHttpError.NotFound(`post not found`);
    }
    if (existingVote) {
      if (existingVote.type === voteType) {
        await db.vote.delete({
          where: {
            userId_postId: {
              postId: postId!,
              userId: session.user.id,
            },
          },
        });

    
        const votesAmt = post.votes.reduce((acc, vote) => {
          if (vote.type === "UP") return acc + 1;
          if (vote.type === "DOWN") return acc - 1;
          return acc;
        }, 0);

        if (votesAmt >= CACHE_AFTER_UPVOTES) {
          const cachePayload: CachedPost = {
            authorUsername: post.author.username ?? "",
            content: JSON.stringify(post.content),
            id: post.id,
            title: post.title,
            currentVote: null,
            createdAt: post.createdAt,
          };

          await redis.hset(`post:${postId}`, cachePayload); 
        }

        return new Response("OK");
      }

      await db.vote.update({
        where: {
          userId_postId: {
            postId: postId!,
            userId: session.user.id,
          },
        },
        data: {
          type: voteType,
        },
      });

      const votesAmt = post.votes.reduce((acc, vote) => {
        if (vote.type === "UP") return acc + 1;
        if (vote.type === "DOWN") return acc - 1;
        return acc;
      }, 0);

      if (votesAmt >= CACHE_AFTER_UPVOTES) {
        const cachePayload: CachedPost = {
          authorUsername: post.author.username ?? "",
          content: JSON.stringify(post.content),
          id: post.id,
          title: post.title,
          currentVote: voteType!,
          createdAt: post.createdAt,
        };

        await redis.hset(`post:${postId}`, cachePayload); 
      }

      return new Response("OK");
    }


    await db.vote.create({
      data: {
        type: voteType!,
        userId: session.user.id,
        postId: postId!,
      },
    });

    const votesAmt = post.votes.reduce((acc, vote) => {
      if (vote.type === "UP") return acc + 1;
      if (vote.type === "DOWN") return acc - 1;
      return acc;
    }, 0);

    if (votesAmt >= CACHE_AFTER_UPVOTES) {
      const cachePayload: CachedPost = {
        authorUsername: post.author.username ?? "",
        content: JSON.stringify(post.content),
        id: post.id,
        title: post.title,
        currentVote: voteType!,
        createdAt: post.createdAt,
      };

      await redis.hset(`post:${postId}`, cachePayload); 
    }

    return new Response("OK");
  } catch (error: any) {
    return errorHandelr(error);
  }
}
