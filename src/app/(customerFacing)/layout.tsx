import Cart from "@/app/(customerFacing)/_components/Cart";
import SearchBar from "@/components/SearchBar";
export const dynamic = "force-dynamic";

import {
   ChartNoAxesCombined,
   CircleUser,
   ShoppingBasket,
   UserRoundPen,
} from "lucide-react";
import { cookies } from "next/headers";
import { decrypt } from "@/lib/session";
import { MobileNav, Nav, NavLink } from "@/components/Nav";
import { ReactNode } from "react";
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuSeparator,
   DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import LogoutButton from "../../components/LogoutButton";

export default async function Layout({ children }: Readonly<{ children: ReactNode }>) {
   const cookie = cookies().get("session")?.value;
   const session = await decrypt(cookie);
   const isAuthenticated = !!session?.userId;

   const navItems = [
      { name: "Home", href: "/", isVisible: true },
      { name: "Products", href: "/products", isVisible: true },
      { name: "Sign In", href: "/sign-in", isVisible: !isAuthenticated },
   ];

   // TODO :refactor
   return (
      <div className="sm:min-h-screen">
         <Nav>
            <div className="flex flex-row items-center justify-between">
               <div className="md:flex flex-row items-center hidden">
                  {navItems.map(
                     (item) =>
                        item.isVisible && (
                           <NavLink key={item.href} href={item.href}>
                              {item.name}
                           </NavLink>
                        )
                  )}
               </div>

               <div className="flex items-center justify-between w-full md:w-auto gap-2 px-2">
                  <MobileNav navItems={navItems} />

                  <SearchBar />

                  <div className="space-x-3 flex items-center">
                     <Cart />

                     {isAuthenticated && (
                        <DropdownMenu>
                           <DropdownMenuTrigger>
                              <CircleUser size={32} className="hover:opacity-75" />
                           </DropdownMenuTrigger>
                           <DropdownMenuContent className="w-48">
                              <DropdownMenuItem asChild>
                                 <Link href="/profile">
                                    <UserRoundPen
                                       size={20}
                                       className="mr-1 stroke-blue-700"
                                    />
                                    Profile
                                 </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem asChild>
                                 <Link href="/orders">
                                    <ShoppingBasket
                                       size={20}
                                       className="mr-1 stroke-green-500"
                                    />{" "}
                                    My Orders
                                 </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem asChild>
                                 <Link href="/admin">
                                    <ChartNoAxesCombined
                                       size={20}
                                       className="mr-1 stroke-purple-700"
                                    />
                                    Sales Dashboard
                                 </Link>
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-destructive">
                                 <LogoutButton isAuthenticated />
                              </DropdownMenuItem>
                           </DropdownMenuContent>
                        </DropdownMenu>
                     )}
                  </div>
               </div>
            </div>
         </Nav>
         <div className="mt-16 flex-1 container py-6">{children}</div>
      </div>
   );
}
