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
import { Product } from "@prisma/client";
import AddToCartButton from "./AddToCartButton";

type ProductCardProps = {
   product: Product;
};

export function ProductCard({ product }: ProductCardProps) {
   const router = useRouter();
   const { id, name, priceInCents, description, imagePath } = product;

   return (
      <Card className="flex overflow-hidden flex-col shadow-sm">
         <div
            className="relative w-full h-auto aspect-video hover:opacity-95  hover:cursor-pointer"
            onClick={() => router.push(`/products/${id}`)}
         >
            <Image src={imagePath} alt={name} fill />
         </div>
         <CardHeader>
            <CardTitle>{name}</CardTitle>
            <CardDescription>
               {priceInCents === 1 ? "Free" : formatCurrency(priceInCents / 100)}
            </CardDescription>
         </CardHeader>
         <CardContent className="flex flex-grow">
            <p className="line-clamp-4">{description}</p>
         </CardContent>
         <CardFooter>
            {priceInCents === 1 ? (
               // TODO : Download functionality
               <Button
                  size="lg"
                  className="w-full bg-green-700 text-white hover:bg-green-600"
               >
                  Download now
               </Button>
            ) : (
               <AddToCartButton product={product} />
            )}
         </CardFooter>
      </Card>
   );
}

export function ProductCardSkeleton() {
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
