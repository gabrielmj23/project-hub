import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const tagsRouter = createTRPCRouter({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.tag.findMany();
  }),
});