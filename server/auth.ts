import NextAuth from "next-auth";
import KeycloakProvider from "next-auth/providers/keycloak";
import { db } from "./db";
import { users } from "./db/schema";
import { eq } from "drizzle-orm";
import { getServerSession } from "next-auth/next";

const authOptions = {
    providers: [
        KeycloakProvider({
            clientId: process.env.KEYCLOAK_CLIENT_ID!,
            clientSecret: process.env.KEYCLOAK_CLIENT_SECRET!,
            issuer: process.env.KEYCLOAK_ISSUER!,
        }),
    ],
    callbacks: {
        async signIn({ user, account }: { user: { id: string; email: string; name?: string }; account: { provider: string; providerAccountId: string } | null }) {
            if (account?.provider === "keycloak") {
                try {
                    const existingUser = await db
                        .select()
                        .from(users)
                        .where(eq(users.keycloakId, account.providerAccountId));

                    if (existingUser.length === 0) {
                        await db.insert(users).values({
                            keycloakId: account.providerAccountId,
                            email: user.email!,
                            name: user.name || null,
                        });
                    }
                } catch (error) {
                    console.error("Error creating user:", error);
                    return false;
                }
            }
            return true;
        },
        async jwt({ token, account }: { token: { dbUserId?: number } & Record<string, unknown>; account: { provider: string; providerAccountId: string } | null }) {
            if (account?.provider === "keycloak") {
                const dbUser = await db
                    .select()
                    .from(users)
                    .where(eq(users.keycloakId, account.providerAccountId));

                if (dbUser.length > 0) {
                    token.dbUserId = dbUser[0].id;
                }
            }
            return token;
        },
        async session({ session, token }: { session: { user: { dbUserId?: number } & Record<string, unknown> } & Record<string, unknown>; token: { dbUserId?: number } & Record<string, unknown> }) {
            if (token.dbUserId) {
                session.user.dbUserId = token.dbUserId;
            }
            return session;
        },
    },
};

// @ts-ignore
export const auth = () => getServerSession(authOptions);
export { authOptions };
// @ts-ignore
export default NextAuth(authOptions);