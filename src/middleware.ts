import { NextRequest, NextResponse } from "next/server";

import { cookies } from "next/headers";
import { decrypt } from "./lib/session";

const protectedRoutes = [
   /^\/orders$/,
   /^\/admin\/.*/,
   /^\/products\/checkout$/,
   /^\/products\/download\/.+$/,
   /^\/profile$/,
];
const publicRoutes = [/^\/sign-up$/, /^\/sign-in$/];

export default async function middleware(req: NextRequest) {
   const path = req.nextUrl.pathname;
   const isProtectedRoute = protectedRoutes.some((route) => route.test(path));
   const isPublicRoute = publicRoutes.some((route) => route.test(path));

   const cookie = cookies().get("session")?.value;
   const session = await decrypt(cookie);

   if (isProtectedRoute && !session?.userId) {
      return NextResponse.redirect(
         new URL(
            `/sign-in?origin=${encodeURIComponent(req.nextUrl.toString())}`,
            req.nextUrl
         )
      );
   }

   if (isPublicRoute && session?.userId) {
      return NextResponse.redirect(new URL("/", req.nextUrl));
   }

   return NextResponse.next();
}
