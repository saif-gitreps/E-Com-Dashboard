"use client";

import { logout } from "@/app/(auth)/_actions/auth";
import { LogOut } from "lucide-react";
import { usePathname } from "next/navigation";

export default function LogoutButton({
   isAuthenticated,
   className,
}: {
   isAuthenticated: boolean;
   className?: string;
}) {
   const pathname = usePathname();

   const handleLogout = async () => {
      await logout(pathname);
   };

   if (isAuthenticated)
      return (
         <div className={`w-full flex items-center ${className}`} onClick={handleLogout}>
            <LogOut size={20} className="mr-1 mt-0.5" />
            Logout
         </div>
      );
   return <></>;
}
