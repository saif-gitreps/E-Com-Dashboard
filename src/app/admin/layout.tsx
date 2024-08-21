import { Nav, NavLink } from "@/components/Nav";

export const dynamic = "force-dynamic"; // We want to prevent caching in admin page, as we need the most updated data.

export default function AdminLayout({
   children,
}: Readonly<{
   children: React.ReactNode;
}>) {
   return (
      <>
         <Nav>
            <NavLink href="/admin">Dashboard</NavLink>
            <NavLink href="/admin/products">Products</NavLink>
            <NavLink href="/admin/users">Customer</NavLink>
            <NavLink href="/admin/orders">Sales</NavLink>
         </Nav>
         <div className="container py-6">{children}</div>
      </>
   );
}
