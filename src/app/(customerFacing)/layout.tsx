import Cart from "@/components/Cart";
import { MobileNav, Nav, NavItem, NavLink } from "@/components/Nav";
import SearchBar from "@/components/SearchBar";
export const dynamic = "force-dynamic";

import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { LogoutButton } from "@/components/LogoutButton";
import { cookies } from "next/headers";
import { decrypt } from "@/lib/session";

export default async function Layout({
   children,
}: Readonly<{
   children: React.ReactNode;
}>) {
   const cookie = cookies().get("session")?.value;
   const session = await decrypt(cookie);
   const isAuthenticated = !!session?.userId;
   const isAdmin = session?.role === "ADMIN";

   const navItems = [
      { name: "Home", href: "/", isVisible: true },
      { name: "Products", href: "/products", isVisible: true },
      { name: "My orders", href: "/orders", isVisible: isAuthenticated },
      { name: "Sign In", href: "/sign-in", isVisible: !isAuthenticated },
      {
         name: `${!isAdmin ? "Seller" : "Admin"} dashboard`,
         href: "/admin",
         isVisible: isAuthenticated,
      },
   ];

   // TODO :refactor
   return (
      <div className="mt-11 sm:mt-0 sm:flex sm:flex-row sm:min-h-screen">
         <Nav>
            <SearchBar />

            {navItems.map(
               (item) =>
                  item.isVisible && (
                     <NavLink key={item.href} href={item.href}>
                        {item.name}
                     </NavLink>
                  )
            )}

            <Cart />

            {isAuthenticated && <LogoutButton />}
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

            <SearchBar />

            <Cart isMobileView />
            {isAuthenticated && <LogoutButton />}
         </MobileNav>

         <div className="sm:ml-32 md:ml-56 flex-1 container py-6">{children}</div>
      </div>
   );
}
