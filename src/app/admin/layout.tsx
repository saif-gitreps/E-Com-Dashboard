import { Nav, NavLink } from "@/components/Nav";

export const dynamic = "force-dynamic"; // We want to prevent caching in admin page, as we need the most updated data.

export default function AdminLayout({
   children,
}: Readonly<{
   children: React.ReactNode;
}>) {
   return (
      <div className="flex flex-row min-h-screen">
         <Nav>
            <NavLink href="/admin">Dashboard</NavLink>
            <NavLink href="/admin/products">Products</NavLink>
            <NavLink href="/admin/users">Customer</NavLink>
            <NavLink href="/admin/orders">Sales</NavLink>
         </Nav>
         <div className="ml-56 flex-1 container py-6">{children}</div>
      </div>
   );
}
