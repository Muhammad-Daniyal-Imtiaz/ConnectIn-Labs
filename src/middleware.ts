import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Public routes that don't need auth (e.g. landing page, public info)
const isPublicRoute = createRouteMatcher(["/", "/api/webhooks/clerk(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  // If it's a private route, enforce auth
  if (!isPublicRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
