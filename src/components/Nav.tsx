"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ComponentProps, ReactNode } from "react";

export function Nav({
   children,
   className,
}: {
   children: ReactNode;
   className?: string;
}) {
   return (
      <nav
         className={`hidden sm:block bg-primary text-primary-foreground fixed inset-y-0 left-0 sm:w-56 sm:h-screen ${className}`}
      >
         <div className="flex flex-col h-full">{children}</div>
      </nav>
   );
}

export function NavLink(props: Omit<ComponentProps<typeof Link>, "className">) {
   const pathname = usePathname();
   return (
      <Link
         {...props}
         className={cn(
            "p-4 hover:bg-secondary hover:text-secondary-foreground focus:bg-secondary focus:text-secondary-foreground",
            pathname === props.href && "bg-background text-foreground"
         )}
      />
   );
}
