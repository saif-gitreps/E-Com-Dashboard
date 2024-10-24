"use client";

import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { useCart } from "@/hooks/use-cart";
import { Product } from "@prisma/client";

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
         {isSuccess
            ? "Already in cart!"
            : isProductInCart
            ? "Already in cart!"
            : "Add to cart!"}
      </Button>
   );
};

export default AddToCartButton;
