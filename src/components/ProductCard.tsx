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
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";

type ProductCardProps = {
   id: string;
   name: string;
   priceInCents: number;
   description: string;
   imagePath: string;
};

export function ProductCard({
   id,
   name,
   priceInCents,
   description,
   imagePath,
}: ProductCardProps) {
   const router = useRouter();

   return (
      <Card
         className="flex overflow-hidden flex-col hover:cursor-pointer hover:opacity-90"
         onClick={() => router.push(`/products/${id}`)}
      >
         <div className="relative w-full h-auto aspect-video">
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
               <Button
                  size="lg"
                  className="w-full bg-green-700 text-white hover:bg-green-600"
               >
                  Download now
               </Button>
            ) : (
               // {TODO: ADD TO CART FUNCTIONALITY}
               <Button asChild size="lg" className="w-full">
                  <Link href={`/products/${id}/purchase`}>Add to cart</Link>
               </Button>
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
