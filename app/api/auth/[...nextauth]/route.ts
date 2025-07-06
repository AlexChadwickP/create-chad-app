import NextAuth from "next-auth";
import KeycloakProvider from "next-auth/providers/keycloak";
import { db } from "@/server/db";
import { users } from "@/server/db/schema";
import { eq } from "drizzle-orm";

const handler = NextAuth({
    providers: [
        KeycloakProvider({
            clientId: process.env.KEYCLOAK_CLIENT_ID!,
            clientSecret: process.env.KEYCLOAK_CLIENT_SECRET!,
            issuer: process.env.KEYCLOAK_ISSUER!,
        }),
    ],
    callbacks: {
        async signIn({ user, account }) {
            if (account?.provider === "keycloak") {
                try {
                    // Check if user already exists
                    const existingUser = await db
                        .select()
                        .from(users)
                        .where(eq(users.keycloakId, account.providerAccountId));

                    if (existingUser.length === 0) {
                        // Create new user
                        await db.insert(users).values({
                            keycloakId: account.providerAccountId,
                            email: user.email!,
                            name: user.name || null,
                        });
                    }
                } catch (error) {
                    console.error("Error creating user:", error);
                    return false; // Prevent sign in on error
                }
            }
            return true;
        },
        async jwt({ token, account }) {
            if (account) {
                token.accessToken = account.access_token;
                // Get the database user ID
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
        async session({ session, token }) {
            session.accessToken = token.accessToken;
            session.dbUserId = token.dbUserId as number;
            return session;
        },
    },
});

export { handler as GET, handler as POST };