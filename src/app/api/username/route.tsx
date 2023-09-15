import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { errorHandelr } from "@/utils/handler";
import { usernameSchema } from "@/utils/validators/usernameSchema";
import createHttpError from "http-errors";

export async function PATCH(req: Request) {
    try {
        const session = await getAuthSession()
        if (!session?.user) {
            throw new createHttpError.Unauthorized(`unauthorized`);
        }
        const body = await req.json()
        const { name } = await usernameSchema.validate(body)

        const username = await db.user.findFirst({
            where: {
                username: name
            }
        })
        if (username) {
            throw new createHttpError[409](`username is taken`);
        }
        await db.user.update({
            where: {
                id: session.user.id
            },
            data: {
                username: name
            }
        })
        return new Response('ok')
    } catch (error: any) {
        return errorHandelr(error)
    }

}