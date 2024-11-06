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
            "bg-primary text-primary-foreground fixed w-full top-0 z-50",
            className
         )}
      >
         <div className="max-w-7xl mx-auto">{children}</div>
      </nav>
   );
}

const navItems = [
   { name: "Home", href: "/", isVisible: true },
   { name: "Products", href: "/products", isVisible: true },
   { name: "Sign In", href: "/sign-in", isVisible: true },
];

export function MobileNav() {
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
      <div
         {...props}
         className={`p-4 hover:bg-secondary hover:cursor-pointer hover:text-secondary-foreground focus:bg-secondary focus:text-secondary-foreground ${className}`}
      >
         {children}
      </div>
   );
}
