"use client";
import { CreditCard, Loader2, ShoppingCart } from "lucide-react";
import { Sheet, SheetContent, SheetFooter, SheetTitle, SheetTrigger } from "./ui/sheet";
import { ScrollArea, ScrollBar } from "./ui/scroll-area";
import { useEffect, useState } from "react";
import { ProductCartItem } from "./ProductCartItem";
import { useCart } from "@/hooks/use-cart";
import { usePathname, useRouter } from "next/navigation";
import { formatCurrency } from "@/lib/formatter";

export default function Cart() {
   const [isMounted, setIsMounted] = useState<boolean>(false);
   const [isOpen, setIsOpen] = useState<boolean>(false);

   const router = useRouter();
   const { items } = useCart();
   const itemCount = items?.length;

   useEffect(() => setIsMounted(true), []);

   const pathname = usePathname();

   const handleCheckout = () => {
      router.push(
         `/products/checkout?${items.map((item) => `pid=${item.product.id}`).join("&")}`
      );
      setIsOpen(false);
   };

   return (
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
         <SheetTrigger
            className={`hover:cursor-pointer ${
               pathname === "/products/checkout" && "hidden"
            }`}
         >
            {isMounted ? (
               <>
                  <ShoppingCart size={32} className="hover:opacity-75" />
                  <div className="relative">
                     <p className="absolute bottom-5 left-2.5 text-red-400">
                        {itemCount}
                     </p>
                  </div>
               </>
            ) : (
               <Loader2 className="animate-spin" />
            )}
         </SheetTrigger>
         <SheetContent side="right" className="max-w-72 flex flex-col h-full">
            {items.length === 0 ? (
               <div className="flex mt-10 justify-center">
                  <SheetTitle>
                     Your
                     <ShoppingCart size={70} className="inline" /> is empty!
                  </SheetTitle>
               </div>
            ) : (
               <>
                  <ScrollArea className="flex-grow w-full border-none h-auto">
                     {items.map((item) => (
                        <ProductCartItem key={item.product.id} {...item?.product} />
                     ))}
                     <ScrollBar orientation="vertical" />
                  </ScrollArea>

                  <div className="font-semibold text-center border-t">
                     Sub-total:{" "}
                     {formatCurrency(
                        items.reduce((acc, item) => acc + item.product.priceInCents, 0) /
                           100
                     )}
                  </div>
                  <SheetFooter className="pt-0 mt-0">
                     <button
                        className="w-full bg-green-700 text-white hover:bg-green-600 p-2 rounded-md flex justify-center items-center"
                        onClick={handleCheckout}
                     >
                        To checkout <CreditCard className="ml-2" />
                     </button>
                  </SheetFooter>
               </>
            )}
         </SheetContent>
      </Sheet>
   );
}
