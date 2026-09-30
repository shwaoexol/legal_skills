import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { prisma } from "./lib/db";
import { compare } from "bcryptjs";



export const { handlers, auth, signIn, sighOut } = NextAuth({
    session: { strategy: 'jwt'},
    providers: [
        Credentials({
            credentials: {
                email: {},
                password: {},
            },
            authorize: async (credentials) => {
                const email = credentials?.email as string;
                const password = credentials?.password as string;

                const user = await prisma.adminUser.findUnique({ where: {email } });
                if (!user) return null;

                const isValid = await compare(password, user.passwordHash);
                if (!isValid) return null;

                return { id: user.id, email: user.email };
            }, 
        }),
    ],
});