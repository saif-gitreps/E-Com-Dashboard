"use client";

import { logout } from "@/app/(auth)/_actions/auth";

export default function LogoutButton({ isAuthenticated }: { isAuthenticated: boolean }) {
   if (isAuthenticated)
      return (
         <p className="w-full" onClick={() => logout()}>
            Logout
         </p>
      );
   return <></>;
}
