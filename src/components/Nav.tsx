"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ComponentProps, ReactNode } from "react";

// TODO: refactor all nav components to sep files

export function Nav({
   children,
   className,
}: {
   children: ReactNode;
   className?: string;
}) {
   return (
      <nav
         className={`hidden sm:block bg-primary text-primary-foreground fixed inset-y-0 left-0 sm:w-32 md:w-56 sm:h-screen ${className}`}
      >
         <div className="flex flex-col h-full">{children}</div>
      </nav>
   );
}

export function MobileNav({
   children,
   className,
}: {
   children: ReactNode;
   className?: string;
}) {
   return (
      <nav
         className={`sm:hidden bg-primary text-primary-foreground py-3 px-4 fixed top-0 z-50 w-full ${className}`}
      >
         <div className="flex flex-row justify-between">{children}</div>
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

type NavItemProps = {
   className?: string;
   [key: string]: any;
   children: ReactNode;
};

export function NavItem({ className, children, ...props }: NavItemProps) {
   return (
      <p
         {...props}
         className={`p-4 hover:bg-secondary hover:cursor-pointer hover:text-secondary-foreground focus:bg-secondary focus:text-secondary-foreground 
            ${className}`}
      >
         {children}
      </p>
   );
}
