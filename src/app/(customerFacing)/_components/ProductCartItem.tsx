"use client";

import { formatCurrency } from "@/lib/formatter";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCart } from "@/hooks/use-cart";
import { Trash2 } from "lucide-react";
import {
   Card,
   CardContent,
   CardDescription,
   CardFooter,
   CardHeader,
   CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

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
      <Card className="flex overflow-hidden justify-between shadow-sm mt-2 h-20 p-1">
         <div className="flex">
            <div
               className="relative aspect-video hover:opacity-75 hover:cursor-pointer"
               onClick={() => router.push(`/products/${id}`)}
            >
               <Image src={imagePath} alt={name} fill />
            </div>
            <CardContent className="flex flex-col justify-between px-2 mt-1 py-0">
               <CardTitle className="text-md">{name}</CardTitle>
               <CardDescription>
                  {priceInCents === 1 ? "Free" : formatCurrency(priceInCents / 100)}
               </CardDescription>
            </CardContent>
         </div>
         <CardFooter className="p-0 flex items-start">
            <Button
               size="sm"
               className="w-full px-2"
               variant="destructive"
               onClick={() => removeItem(id)}
            >
               <Trash2 />
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
