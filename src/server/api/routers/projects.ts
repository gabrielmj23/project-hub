import { clerkClient } from "@clerk/nextjs";
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

  getById: privateProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      const project = await ctx.prisma.project.findUnique({
        where: {
          id: input
        },
        include: {
          tags: true
        }
      });
      if (!project)
        throw new TRPCError({ code: "NOT_FOUND" });

      const user = await clerkClient.users.getUser(project.authorId);
      if (!user)
        throw new TRPCError({ code: "NOT_FOUND" });

      return {
        project,
        author: {
          id: user.id,
          username: user.username,
          imageUrl: user.imageUrl
        },
      };
  }),

  getByAuthorId: privateProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      const projects = await ctx.prisma.project.findMany({
        take: 50,
        where: {
          authorId: input
        },
        orderBy: {
          createdAt: "desc"
        }
      });
      return projects.filter((project) => ({
        id: project.id,
        title: project.title,
        description: project.description,
      }));
  }),

  getBySearch: privateProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      const projects = await ctx.prisma.project.findMany({
        take: 50,
        where: {
          OR: [
            { title: { contains: input } },
            { description: { contains: input } },
          ]
        },
        orderBy: {
          createdAt: "desc"
        }
      });
      return projects.filter((project) => ({
        id: project.id,
        title: project.title,
        description: project.description,
      }));
  }),

  create: privateProcedure
    .input(
      z.object({
        title: z.string().trim().min(1).max(100),
        description: z.string().trim().min(1).max(255),
        requirements: z.string().trim().min(1).max(255),
        suggestions: z.string().trim().min(1).max(255),
        additional: z.string().optional(),
        tags: z.array(z.object({
          id: z.string(),
          name: z.string(),
          type: z.string(),
        })),
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
          ...input,
          tags: {
            connect: input.tags.map(tag => ({ id: tag.id }))
          }
        }
      });

      return project;
    })
});
