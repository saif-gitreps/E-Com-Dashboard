import { Button } from "@/components/ui/button";

import Link from "next/link";
import {
   Table,
   TableBody,
   TableCell,
   TableHead,
   TableHeader,
   TableRow,
} from "@/components/ui/table";
import db from "@/db/db";
import { CheckCircle2, MoreVertical, ShieldAlert, XCircle } from "lucide-react";
import { formatCurrency, formatNumber } from "@/lib/formatter";
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuSeparator,
   DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
   ActiveToggleDropdownItem,
   ApproveProductDropdownItem,
   DeleteDropdownItem,
} from "./_components/ProductActions";
import { PageHeader } from "@/components/PageHeader";
import { getCurrentUserFromSession } from "@/app/(auth)/_actions/auth";

export default function AdminProductsPage() {
   return (
      <>
         <div className="flex justify-between items-center gap-4">
            <PageHeader>Products</PageHeader>
            <Button asChild>
               <Link href="/admin/products/new">Add Product</Link>
            </Button>
         </div>
         <div className="flex space-x-2 italic text-sm">
            <div className="flex">
               <ShieldAlert className="stroke-yellow-500 mr-1" size={20} />
               <span className="">Pending approval</span>
            </div>
            <div className="flex">
               <CheckCircle2 className="stroke-green-600 mr-1" size={20} />
               <span className="">Active</span>
            </div>
            <div className="flex">
               <XCircle className="stroke-destructive mr-1" size={20} />
               <span className="">Inactive</span>
            </div>
         </div>
         <ProductsTable />
      </>
   );
}

async function ProductsTable() {
   const user = await getCurrentUserFromSession();

   const isAdmin = user?.role === "admin";

   const products = await db.product.findMany({
      select: {
         id: true,
         name: true,
         priceInCents: true,
         isAvailableForPurchase: true,
         isApprovedByAdmin: true,
         _count: { select: { orders: true } },
      },
      orderBy: {
         name: "asc",
      },
      where: {
         ...(isAdmin ? {} : { userId: user?.userId as string }),
      },
   });

   if (products.length === 0) return <p>No products found.</p>;

   return (
      <Table>
         <TableHeader>
            <TableRow>
               <TableHead className="w-0">
                  <span className="sr-only">Available for purchase</span>
               </TableHead>
               <TableHead>Name</TableHead>
               <TableHead>Price</TableHead>
               <TableHead>Orders</TableHead>
               <TableHead className="w-0">
                  <span className="sr-only">Actions</span>
               </TableHead>
            </TableRow>
         </TableHeader>
         <TableBody>
            {products.map((product) => (
               <TableRow
                  key={product.id}
                  className={!product.isApprovedByAdmin ? "opacity-75 italic" : ""}
               >
                  <TableCell>
                     {!product.isApprovedByAdmin ? (
                        <>
                           <ShieldAlert className="stroke-yellow-500" />
                           <span className="sr-only">Pending approval</span>
                        </>
                     ) : product.isAvailableForPurchase ? (
                        <>
                           <CheckCircle2 className="stroke-green-600" />
                           <span className="sr-only">Available</span>
                        </>
                     ) : (
                        <>
                           <XCircle className="stroke-destructive" />
                           <span className="sr-only">Unavailable</span>
                        </>
                     )}
                  </TableCell>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>{formatCurrency(product.priceInCents / 100)}</TableCell>
                  <TableCell>{formatNumber(product._count.orders)}</TableCell>
                  <TableCell>
                     <DropdownMenu>
                        <DropdownMenuTrigger>
                           <MoreVertical />
                           <span className="sr-only"></span>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                           <DropdownMenuItem asChild>
                              <a download href={`/admin/products/${product.id}/download`}>
                                 Download
                              </a>
                           </DropdownMenuItem>
                           <DropdownMenuItem asChild>
                              <Link href={`/admin/products/${product.id}/edit`}>
                                 Edit
                              </Link>
                           </DropdownMenuItem>
                           <DropdownMenuSeparator />

                           {!product.isApprovedByAdmin && !isAdmin ? (
                              <DropdownMenuItem className="opacity-70 italic hover:cursor-default">
                                 Pending approval
                              </DropdownMenuItem>
                           ) : (
                              <ActiveToggleDropdownItem
                                 id={product.id}
                                 isAvailableForPurchase={product.isAvailableForPurchase}
                              />
                           )}

                           <DeleteDropdownItem
                              id={product.id}
                              disabled={product._count.orders > 0}
                           />

                           {isAdmin && !product.isApprovedByAdmin && (
                              <ApproveProductDropdownItem id={product.id} />
                           )}
                        </DropdownMenuContent>
                     </DropdownMenu>
                  </TableCell>
               </TableRow>
            ))}
         </TableBody>
      </Table>
   );
}
