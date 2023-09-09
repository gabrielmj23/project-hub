import { authMiddleware } from "@clerk/nextjs";

export default authMiddleware({ publicRoutes: ["/"] });
 
export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/((?!_next/image|_next/static|favicon.ico).*)"],
};
