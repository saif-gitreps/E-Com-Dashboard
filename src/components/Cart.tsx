"use client";
import { CreditCard, Loader2, ShoppingCart } from "lucide-react";
import {
   Sheet,
   SheetContent,
   SheetFooter,
   SheetHeader,
   SheetTitle,
   SheetTrigger,
} from "./ui/sheet";

import { ScrollArea, ScrollBar } from "./ui/scroll-area";
import { useEffect, useState } from "react";
import { ProductCartItem } from "./ProductCartItem";
import { useCart } from "@/hooks/use-cart";
import { NavItem } from "./Nav";

const Cart = ({ isMobileView = false }: { isMobileView?: boolean }) => {
   const [isMounted, setIsMounted] = useState<boolean>(false);

   useEffect(() => setIsMounted(true), []);

   const { items } = useCart();
   const itemCount = items?.length;

   return (
      <Sheet>
         <SheetTrigger
            className={`${isMobileView && "text-xl relative"} hover:cursor-pointer`}
            asChild={!isMobileView}
         >
            {!isMobileView ? (
               <NavItem>
                  Cart (
                  {isMounted ? itemCount : <Loader2 className="animate-spin sm:hidden" />}
                  )
               </NavItem>
            ) : (
               <>
                  <ShoppingCart size={40} />

                  <p className="sm:hidden absolute top-3 right-2.5 text-xs">
                     {isMounted ? (
                        itemCount
                     ) : (
                        <Loader2 className="animate-spin sm:hidden" />
                     )}
                  </p>
               </>
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

                  <SheetFooter>
                     <button className="w-full bg-green-700 text-white hover:bg-green-600 p-2 rounded-md flex justify-center">
                        Checkout <CreditCard className="ml-2" />
                     </button>
                  </SheetFooter>
               </>
            )}
         </SheetContent>
      </Sheet>
   );
};

export default Cart;
