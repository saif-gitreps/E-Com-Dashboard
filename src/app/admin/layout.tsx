import { MobileNav, Nav, NavItem, NavLink } from "@/components/Nav";
import LogoutButton from "../../components/LogoutButton";
import { getCurrentUserFromSession } from "../(auth)/_actions/auth";

export const dynamic = "force-dynamic"; // We want to prevent caching in admin page, as we need the most updated data.

export default async function AdminLayout({
   children,
}: Readonly<{
   children: React.ReactNode;
}>) {
   const user = await getCurrentUserFromSession();

   const isAdmin = user?.role === "admin";

   const navItems = [
      { name: "Dashboard", href: "/admin", isVisible: true },
      { name: "Products", href: "/admin/products", isVisible: true },
      { name: "Sales", href: "/admin/orders", isVisible: true },
      { name: "Users", href: "/admin/users", isVisible: isAdmin },
      {
         name: "Buy Products",
         href: "/products",
         isVisible: !isAdmin,
      },
   ];

   return (
      <div className="min-h-screen">
         <Nav>
            <div className="flex flex-row items-center justify-between h-auto">
               <div className="md:flex flex-row  items-center hidden">
                  {navItems.map(
                     (item) =>
                        item.isVisible && (
                           <NavLink key={item.href} href={item.href}>
                              {item.name}
                           </NavLink>
                        )
                  )}
               </div>
               <NavItem className="text-destructive hidden md:block">
                  <LogoutButton isAuthenticated={true} />
               </NavItem>
            </div>

            <div className="flex items-center justify-between w-full md:w-auto gap-2 ps-2">
               <MobileNav navItems={navItems} />
               <NavItem className="text-destructive md:hidden">
                  <LogoutButton isAuthenticated={true} />
               </NavItem>
            </div>
         </Nav>
         <div className="mt-16 flex-1 container py-6">{children}</div>
      </div>
   );
}
