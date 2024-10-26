import { NextRequest, NextResponse } from "next/server";

/*

import { isValidPassword } from "./lib/isValidPassword";

export async function middleware(req: NextRequest) {
   if ((await isAuthenticated(req)) === false) {
      return new NextResponse("Unauthorized", {
         status: 401,
         headers: { "WWW-Authenticate": "Basic" },
      });
   }
}

async function isAuthenticated(req: NextRequest) {
   const authHeader =
      req.headers.get("authorization") || req.headers.get("Authorization");

   if (!authHeader) return false;

   // The auth header will be 'basic <encrypted sring>, we split it, take the second part.
   // The second part looks like this 'username:password', we split it again.
   const [username, password] = Buffer.from(authHeader.split(" ")[1], "base64")
      .toString()
      .split(":");

   return true;
}

// covers any page with /admin/ in the path
export const config = {
   matcher: "/admin/:path",
};

*/

import { cookies } from "next/headers";
import { decrypt } from "./lib/session";

const protectedRoutes = [
   "/products/checkout",
   "/orders",
   // "/admin:path", TODO: activate it again.
   // "/products/:id/purchase" <- will be depreciated , new one will be products/checkout,
   "/products/download/:downloadVerificationId",
];
const publicRoutes = ["/sign-up", "/sign-in"];

export default async function middleware(req: NextRequest) {
   const path = req.nextUrl.pathname;
   const isProtectedRoute = protectedRoutes.includes(path);
   const isPublicRoute = publicRoutes.includes(path);

   const cookie = cookies().get("session")?.value;
   const session = await decrypt(cookie);

   if (isProtectedRoute && !session?.userId) {
      return NextResponse.redirect(new URL("/", req.nextUrl));
   }

   if (isPublicRoute && session?.userId) {
      return NextResponse.redirect(new URL("/", req.nextUrl));
   }

   return NextResponse.next();
}
