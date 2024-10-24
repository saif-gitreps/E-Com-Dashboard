import Cart from "@/components/Cart";
import { MobileNav, Nav, NavItem, NavLink } from "@/components/Nav";
import SearchBar from "@/components/SearchBar";
export const dynamic = "force-dynamic";

import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";

export default function Layout({
   children,
}: Readonly<{
   children: React.ReactNode;
}>) {
   const navItems = [
      { name: "Home", href: "/" },
      { name: "Products", href: "/products" },
      { name: "My orders", href: "/orders" },
      { name: "Sign In", href: "/sign-in" },
      { name: "Logout" },
   ];

   // TODO: Implement authentication for nav element and refactor
   return (
      <div className="mt-11 sm:mt-0 sm:flex sm:flex-row sm:min-h-screen">
         <Nav>
            <SearchBar />

            {navItems.map((item) =>
               item.href ? (
                  <NavLink key={item.href} href={item.href}>
                     {item.name}
                  </NavLink>
               ) : (
                  <NavItem key={item.name}>{item.name}</NavItem>
               )
            )}

            <Cart />
         </Nav>

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

            <SearchBar />

            <Cart isMobileView />
         </MobileNav>

         <div className="sm:ml-32 md:ml-56 flex-1 container py-6">{children}</div>
      </div>
   );
}
