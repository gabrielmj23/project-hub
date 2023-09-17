import { clerkClient } from "@clerk/nextjs";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { createTRPCRouter, privateProcedure } from "~/server/api/trpc";

export const usersRouter = createTRPCRouter({
  getByUsername: privateProcedure
    .input(z.string())
    .query(async ({ input }) => {
      const [user] = await clerkClient.users.getUserList({ username: [input] });
      if (!user) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User not found",
        });
      }
      return {
        id: user.id,
        username: user.username,
        imageUrl: user.imageUrl,
      }
  }),
});
