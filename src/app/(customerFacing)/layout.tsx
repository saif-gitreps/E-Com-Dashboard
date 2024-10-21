import { Nav, NavLink } from "@/components/Nav";

export const dynamic = "force-dynamic";

import {
   Sheet,
   SheetContent,
   SheetDescription,
   SheetHeader,
   SheetTitle,
   SheetTrigger,
} from "@/components/ui/sheet";
import { sign } from "crypto";

export default function Layout({
   children,
}: Readonly<{
   children: React.ReactNode;
}>) {
   return (
      <div className="sm:flex sm:flex-row sm:min-h-screen relative">
         <Nav>
            <NavLink href="/">Home</NavLink>
            <NavLink href="/products">Products</NavLink>
            <NavLink href="/orders">My orders</NavLink>
            <NavLink href="/sign-in">Sign In</NavLink>
         </Nav>

         <div>
            <div className="flex justify-between">
               <Sheet>
                  <SheetTrigger className="text-xl">Open</SheetTrigger>
                  <SheetContent side="left" className="max-w-40">
                     <SheetHeader>
                        <SheetTitle>Are you absolutely sure?</SheetTitle>
                        <SheetDescription>
                           This action cannot be undone. This will permanently delete your
                           account and remove your data from our servers.
                        </SheetDescription>
                     </SheetHeader>
                  </SheetContent>
               </Sheet>

               <Sheet>
                  <SheetTrigger className="text-xl">Open</SheetTrigger>
                  <SheetContent side="right" className="max-w-48">
                     <SheetHeader>
                        <SheetTitle>Are you absolutely sure?</SheetTitle>
                        <SheetDescription>
                           This action cannot be undone. This will permanently delete your
                           account and remove your data from our servers.
                        </SheetDescription>
                     </SheetHeader>
                  </SheetContent>
               </Sheet>
            </div>
         </div>

         <div className="sm:ml-56 flex-1 container py-6">{children}</div>
      </div>
   );
}
