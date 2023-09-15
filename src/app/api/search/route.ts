import { db } from "@/lib/db";
import createHttpError from "http-errors";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const q = url.searchParams.get("q");
  if (!q) throw new createHttpError[400](`invalid query`);
  const result = await db.subreddit.findMany({
    where: {
      name: {
        startsWith: q,
      },
    },
    include: {
      _count: true,
    },
    take: 5,
  });
  return new Response(JSON.stringify(result));
}
