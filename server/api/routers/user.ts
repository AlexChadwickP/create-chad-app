import { z } from "zod";
import { createTRPCRouter, publicProcedure, protectedProcedure } from "@/server/api/trpc";
import { users } from "@/server/db/schema";
import { eq } from "drizzle-orm";

export const userRouter = createTRPCRouter({
    getAll: publicProcedure.query(async ({ ctx }) => {
        return ctx.db.select().from(users);
    }),

    getCurrent: protectedProcedure.query(async ({ ctx }) => {
        const dbUserId = (ctx.session?.user as { dbUserId?: number } | undefined)?.dbUserId;
        if (!dbUserId) {
            throw new Error("No user ID in session");
        }

        const user = await ctx.db
            .select()
            .from(users)
            .where(eq(users.id, dbUserId));

        return user[0];
    }),

    updateProfile: protectedProcedure
        .input(z.object({
            name: z.string().min(1),
        }))
        .mutation(async ({ ctx, input }) => {
            const dbUserId = (ctx.session?.user as { dbUserId?: number } | undefined)?.dbUserId;
            if (!dbUserId) {
                throw new Error("No user ID in session");
            }

            const updatedUser = await ctx.db
                .update(users)
                .set({ name: input.name })
                .where(eq(users.id, dbUserId))
                .returning();

            return updatedUser[0];
        }),
});