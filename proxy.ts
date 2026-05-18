import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isProtectedRoute = createRouteMatcher([
  "/dashboard(.*)",
  "/chat(.*)",
  "/mood(.*)",
  "/audio(.*)",
  "/programs(.*)",
  "/emergency(.*)",
  "/institutional(.*)",
  "/profile(.*)",
  "/api/chat(.*)",
  "/api/mood(.*)",
  "/api/moods(.*)",
  "/api/messages(.*)",
  "/api/sessions(.*)",
  "/api/insights(.*)",
  "/api/dashboard(.*)",
  "/api/programs(.*)",
  "/api/audio(.*)",
  "/api/auth/sync(.*)"
]);

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)"
  ]
};
