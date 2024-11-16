"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ComponentProps, ReactNode } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";

export function Nav({
   children,
   className,
}: {
   children: ReactNode;
   className?: string;
}) {
   return (
      <nav
         className={cn(
            "bg-black text-primary-foreground fixed w-full top-0 z-50 ",
            className
         )}
      >
         <div className="max-w-7xl mx-auto">{children}</div>
      </nav>
   );
}

export function MobileNav({
   navItems,
}: {
   navItems: { name: string; href: string; isVisible: boolean }[];
}) {
   return (
      <nav className="md:hidden flex items-center h-14">
         <Sheet>
            <SheetTrigger className="text-xl md:hidden ">
               <Menu size={40} />
            </SheetTrigger>
            <SheetContent side="left" className="max-w-40 flex flex-col p-0 md:hidden">
               <div className="mt-10"></div>
               {navItems.map(
                  (item) =>
                     item.isVisible && (
                        <NavLink key={item.href} href={item.href}>
                           {item.name}
                        </NavLink>
                     )
               )}
            </SheetContent>
         </Sheet>
      </nav>
   );
}

export function NavLink(props: Omit<ComponentProps<typeof Link>, "className">) {
   const pathname = usePathname();
   return (
      <Link
         {...props}
         className={cn(
            "p-4 hover:underline underline-offset-8 focus:underline",
            pathname === props.href && "underline "
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
      <div
         {...props}
         className={`p-4 hover:underline underline-offset-8 focus:underline hover:cursor-pointer ${className}`}
      >
         {children}
      </div>
   );
}
