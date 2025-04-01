// import { authMiddleware } from '@clerk/nextjs';
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isPublicRoute = createRouteMatcher([
  "/", // Home page
  "/dashboard",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/api/webhook(.*)",
]);

export default clerkMiddleware(async (auth, request) => {
  if (!isPublicRoute(request)) {
    await auth.protect();
  }
});

// export default authMiddleware({
//   publicRoutes: ["/"], // The homepage is public
//   afterAuth(auth, req) {
//     if (!auth.userId && !auth.isPublicRoute) {
//       return NextResponse.redirect(new URL("/", req.url));
//     }
//     // Optionally, allow authenticated users to proceed
//     if (auth.userId) {
//       return NextResponse.next();
//     }
//     // For public routes, just continue
//     return NextResponse.next();
//   },
// });

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
  // matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
