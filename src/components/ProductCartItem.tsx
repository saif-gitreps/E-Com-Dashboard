"use client";

import { formatCurrency } from "@/lib/formatter";
import {
   Card,
   CardContent,
   CardDescription,
   CardFooter,
   CardHeader,
   CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCart } from "@/hooks/use-cart";

type ProductCartItemProps = {
   id: string;
   name: string;
   priceInCents: number;
   description: string;
   imagePath: string;
};

export function ProductCartItem({
   id,
   name,
   priceInCents,
   imagePath,
}: ProductCartItemProps) {
   const router = useRouter();
   const { removeItem } = useCart();

   return (
      <Card className="flex overflow-hidden flex-col shadow-sm mt-4">
         <div
            className="relative w-full h-auto aspect-video hover:opacity-95  hover:cursor-pointer"
            onClick={() => router.push(`/products/${id}`)}
         >
            <Image src={imagePath} alt={name} fill />
         </div>
         <CardContent className="flex justify-between py-1 px-5 mt-1">
            <CardTitle>{name}</CardTitle>
            <CardDescription>
               {priceInCents === 1 ? "Free" : formatCurrency(priceInCents / 100)}
            </CardDescription>
         </CardContent>
         <CardFooter className="p-2">
            <Button
               size="lg"
               className="w-full "
               variant="destructive"
               onClick={() => removeItem(id)}
            >
               Remove
            </Button>
         </CardFooter>
      </Card>
   );
}

export function ProductCartItemSkeleton() {
   return (
      <Card className="overflow-hidden flex flex-col animate-pulse">
         <div className="w-full aspect-video bg-gray-300" />
         <CardHeader>
            <CardTitle>
               <div className="w-3/4 h-6 rounded-full bg-gray-300" />
            </CardTitle>
            <CardDescription>
               <div className="w-1/2 h-4 rounded-full bg-gray-300" />
            </CardDescription>
         </CardHeader>
         <CardContent className="space-y-2">
            <div className="w-full h-4 rounded-full bg-gray-300" />
            <div className="w-full h-4 rounded-full bg-gray-300" />
            <div className="w-3/4 h-4 rounded-full bg-gray-300" />
         </CardContent>
         <CardFooter>
            <Button className="w-full" disabled size="lg"></Button>
         </CardFooter>
      </Card>
   );
}
