import { NextRequest, NextResponse } from "next/server";
import { isValid } from "zod";
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

   isValidPassword(password, "password");

   //    return (
   //       username === process.env.ADMIN_USERNAME &&
   //       (await isValidPassword(password, process.env.ADMIN_PASSWORD as string))
   //    );
}

// covers any page with /admin/ in the path
export const config = {
   matcher: "/admin/:path",
};
