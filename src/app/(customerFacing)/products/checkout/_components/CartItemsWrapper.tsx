"use client";
import { useCart } from "@/hooks/use-cart";
import { useEffect, useState } from "react";

export default function CartItemsWrapper({ children }: { children: React.ReactNode }) {
   const [isMounted, setIsMounted] = useState(false);
   const { items } = useCart();

   useEffect(() => {
      setIsMounted(true);
   }, []);

   if (!isMounted) return <div>Loading...</div>;

   if (items.length === 0) return <div>Cart is empty</div>;

   const searchParams = new URLSearchParams();

   items.forEach((item) => {
      searchParams.append("productIds", item.product.id);
   });

   const urlWithParams = `?${searchParams.toString()}`;
   window.history.replaceState({}, "", urlWithParams);

   return children;
}
