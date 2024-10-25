"use client";

import { logout } from "@/app/(auth)/_actions/auth";

type LogoutButtonProps = {
   className?: string;
   [key: string]: any;
};

export function LogoutButton({ className, ...props }: LogoutButtonProps) {
   return (
      <p
         {...props}
         onClick={() => logout()}
         className={`p-4 hover:cursor-pointer hover:bg-red-700 focus:text-secondary-foreground 
            ${className}`}
      >
         Logout
      </p>
   );
}
