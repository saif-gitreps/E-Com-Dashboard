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
import Link from "next/link";
import AddToCartButton from "@/app/(customerFacing)/_components/AddToCartButton";
import { Download, Star } from "lucide-react";
import getAverageRating from "@/lib/get-average-rating";

type ProductCardProps = {
   product: Product;
   averageRating?: number;
};

export function ProductCard({ product, averageRating }: ProductCardProps) {
   const router = useRouter();
   const { id, name, priceInCents, description, imagePath } = product;

   return (
      <Card className="flex overflow-hidden flex-col shadow-sm">
         <div
            className="relative w-full h-auto aspect-video hover:opacity-80 hover:cursor-pointer"
            onClick={() => router.push(`/products/${id}`)}
         >
            <Image src={imagePath} alt={name} fill />
         </div>
         <CardHeader>
            <CardTitle
               className={`${
                  averageRating !== undefined && "flex space-x-2 justify-between"
               }`}
            >
               <div>{name}</div>

               {averageRating !== undefined && (
                  <div className="space-x-2 flex">
                     <Star className="fill-yellow-500" />
                     {getAverageRating([], averageRating)}
                  </div>
               )}
            </CardTitle>
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
                  <Link href={`/products/download/free/${id}`}>Download now</Link>
                  <Download size={18} className="ml-1" />
               </Button>
            ) : (
               <div className="flex w-full gap-1">
                  <Button size="lg" variant="outline" asChild className="w-1/3">
                     <Link href={`/products/${id}`}>View</Link>
                  </Button>
                  <AddToCartButton product={product} />
               </div>
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
