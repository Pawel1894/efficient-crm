import { withClerkMiddleware, getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Set the paths that don't require the user to be signed in
const publicPaths = ["/", "/auth*", "/user-setup"];

const isPublic = (path: string) => {
  return publicPaths.find((x) => path.match(new RegExp(`^${x}$`.replace("*$", "($|/)"))));
};

export default withClerkMiddleware((request: NextRequest) => {
  if (isPublic(request.nextUrl.pathname)) {
    return NextResponse.next();
  }
  const { userId } = getAuth(request);

  if (!userId) {
    const signInUrl = new URL("/auth", request.url);
    signInUrl.searchParams.set("redirect_url", request.url);
    return NextResponse.redirect(signInUrl);
  }
  return NextResponse.next();
});

export const config = { matcher: "/((?!_next/image|_next/static|favicon.ico).*)" };
