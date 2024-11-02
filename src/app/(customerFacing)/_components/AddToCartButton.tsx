"use client";

import { useEffect, useState } from "react";

import { useCart } from "@/hooks/use-cart";
import { Product } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { CheckCircle, ShoppingCart } from "lucide-react";

const AddToCartButton = ({ product }: { product: Product }) => {
   const [isSuccess, setIsSuccess] = useState<boolean>(false);
   const { addItem, items } = useCart();

   useEffect(() => {
      const timeout = setTimeout(() => {
         setIsSuccess(false);
      }, 2000);

      return () => clearTimeout(timeout);
   }, [isSuccess]);

   const isProductInCart = items.some((item) => item.product.id === product.id);

   return (
      <Button
         onClick={() => {
            addItem(product);
            setIsSuccess(true);
         }}
         size="lg"
         className="w-full"
         disabled={isProductInCart}
         variant={isProductInCart ? "secondary" : "default"}
      >
         {isSuccess ? (
            <>
               In cart <CheckCircle size={18} className="ml-1 fill-green-500" />
            </>
         ) : isProductInCart ? (
            <>
               In cart <CheckCircle size={18} className="ml-1 fill-green-500" />
            </>
         ) : (
            <>
               Add to cart <ShoppingCart size={18} className="ml-1" />
            </>
         )}
      </Button>
   );
};

export default AddToCartButton;
