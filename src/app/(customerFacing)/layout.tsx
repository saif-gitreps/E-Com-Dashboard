import { MobileNav, Nav, NavItem, NavLink } from "@/components/Nav";
export const dynamic = "force-dynamic";

import {
   Sheet,
   SheetContent,
   SheetHeader,
   SheetTitle,
   SheetTrigger,
} from "@/components/ui/sheet";
import { Menu, ShoppingCart } from "lucide-react";

export default function Layout({
   children,
}: Readonly<{
   children: React.ReactNode;
}>) {
   // Define the nav items, some with href (NavLink) and some without (NavItem)
   const navItems = [
      { name: "Home", href: "/" },
      { name: "Products", href: "/products" },
      { name: "My orders", href: "/orders" },
      { name: "Sign In", href: "/sign-in" },
      { name: "Logout" }, // No href for NavItem
      { name: "Cart (0)" }, // No href for NavItem
   ];

   return (
      <div className="sm:flex sm:flex-row sm:min-h-screen relative">
         {/* Large screen nav */}
         <Nav>
            {navItems.map((item) =>
               item.href ? (
                  <NavLink key={item.href} href={item.href}>
                     {item.name}
                  </NavLink>
               ) : (
                  <NavItem key={item.name}>{item.name}</NavItem>
               )
            )}
         </Nav>

         {/* Mobile sheet nav */}
         <MobileNav>
            <Sheet>
               <SheetTrigger className="text-xl">
                  <Menu size={40} />
               </SheetTrigger>
               <SheetContent side="left" className="max-w-40 flex flex-col p-0">
                  <SheetTitle className="text-center mt-20">
                     <span aria-hidden></span>
                  </SheetTitle>
                  {navItems.map((item) =>
                     item.href ? (
                        <NavLink key={item.href} href={item.href}>
                           {item.name}
                        </NavLink>
                     ) : (
                        <NavItem key={item.name}>{item.name}</NavItem>
                     )
                  )}
               </SheetContent>
            </Sheet>

            <Sheet>
               <SheetTrigger className="text-xl relative">
                  <ShoppingCart size={40} />
                  <p className="absolute top-2.5 right-3 text-xs">0</p>
               </SheetTrigger>
               <SheetContent side="right" className="max-w-72">
                  <SheetHeader>
                     <SheetTitle>Are you absolutely sure?</SheetTitle>
                     <p>
                        This action cannot be undone. This will permanently delete your
                        account and remove your data from our servers.
                     </p>
                  </SheetHeader>
               </SheetContent>
            </Sheet>
         </MobileNav>

         {/* Page content */}
         <div className="sm:ml-32 md:ml-40 flex-1 container py-6">{children}</div>
      </div>
   );
}
