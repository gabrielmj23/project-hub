import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { createTRPCRouter, privateProcedure, publicProcedure } from "~/server/api/trpc";

export const projectsRouter = createTRPCRouter({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.project.findMany({
      take: 100,
      orderBy: {
        createdAt: "desc"
      }
    });
  }),

  create: privateProcedure
    .input(
      z.object({
        title: z.string().trim().min(1).max(100),
        description: z.string().trim().min(1).max(255),
        requirements: z.string().trim().min(1).max(255),
        suggestions: z.string().trim().min(1).max(255),
        additional: z.string().optional()
      }))
    .mutation(async ({ ctx, input }) => {
      const authorId = ctx.userId;
      if (input.additional) {
        if (input.additional.trim().length > 255 || input.additional.trim().length == 0) {
          throw new TRPCError({ code: "BAD_REQUEST" });
        }
        input.additional = input.additional.trim();
      }

      const project = await ctx.prisma.project.create({
        data: {
          authorId,
          ...input
        }
      })

      return project;
    })
});
