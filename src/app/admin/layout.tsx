import { Nav, NavItem, NavLink } from "@/components/Nav";
import LogoutButton from "../(customerFacing)/_components/LogoutButton";
import { getCurrentUserFromSession } from "../(auth)/_actions/auth";

export const dynamic = "force-dynamic"; // We want to prevent caching in admin page, as we need the most updated data.

export default async function AdminLayout({
   children,
}: Readonly<{
   children: React.ReactNode;
}>) {
   const user = await getCurrentUserFromSession();

   const isAdmin = user?.role === "admin";

   return (
      <div className="min-h-screen">
         <Nav>
            <div className="flex flex-row items-center justify-between h-auto">
               <div className="flex flex-row items-center ">
                  <NavLink href="/admin">Dashboard</NavLink>

                  <NavLink href="/admin/products">
                     {isAdmin ? "All" : "My"} Products
                  </NavLink>

                  {/* Users page will have the people that are selling products and has bought the products */}
                  {isAdmin && <NavLink href="/admin/users">Users</NavLink>}

                  {!isAdmin && <NavLink href="/admin/customers">Customers</NavLink>}

                  <NavLink href="/admin/orders">Sales</NavLink>

                  {!isAdmin && <NavLink href="/">Buy Products</NavLink>}

                  <NavItem className="text-destructive">
                     <LogoutButton isAuthenticated={true} />
                  </NavItem>
               </div>
            </div>
         </Nav>
         <div className="mt-16 flex-1 container py-6">{children}</div>
      </div>
   );
}
