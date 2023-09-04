import { db } from "@/lib/db";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { nanoid } from "nanoid";
import { NextAuthOptions, getServerSession } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import { credentialsSchema } from "@/utils/validators/credentialsSchema";
import createHttpError from "http-errors";
export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(db),
  session: {
    strategy: "jwt",
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials: any) {
        try {
          const { email, password } = await credentialsSchema.validate(
            credentials
          );
          const user = await db.user.findUnique({
            where: {
              email,
            },
          });
          if (!user || !user?.password) {
            throw new createHttpError.NotFound("No user found");
          }
          const passwordMatch = await bcrypt.compare(password, user.password);

          if (!passwordMatch) {
            throw new createHttpError.NotAcceptable(
              "email or password incorrect "
            );
          }
          return user;
        } catch (error: any) {
          throw new createHttpError.BadRequest(error);
        }
      },
    }),
  ],
  callbacks: {
    async session({ token, session }) {
      if (token) {
        session.user.id = token.id;
        session.user.name = token.name;
        session.user.email = token.email;
        session.user.image = token.picture;
        session.user.username = token.username;
      }
      return session;
    },

    async jwt({ token, user }) {

      const dbUser = await db.user.findFirst({
        where: {
          email: token.email,
        },
      });
   

      if (!dbUser) {
        token.id = user!.id;
        return token;
      }

      if (!dbUser.username) {
        await db.user.update({
          where: {
            id: dbUser.id,
          },
          data: {
            username: nanoid(10),
          },
        });
      }

      return {
        id: dbUser.id,
        name: dbUser.name,
        email: dbUser.email,
        picture: dbUser.image,
        username: dbUser.username,
      };
    },
  },
};

export const getAuthSession = () => getServerSession(authOptions);
