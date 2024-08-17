import { Nav, NavLink } from "@/components/Nav";

export default function AdminLayout({
   children,
}: Readonly<{
   children: React.ReactNode;
}>) {
   return (
      <>
         <Nav>
            <NavLink href="/admin">Dashboard</NavLink>
            <NavLink href="/admin/product">Products</NavLink>
            <NavLink href="/admin/users">Customer</NavLink>
            <NavLink href="/admin/orders">Sales</NavLink>
         </Nav>
         <div className="container py-6">{children}</div>
      </>
   );
}
