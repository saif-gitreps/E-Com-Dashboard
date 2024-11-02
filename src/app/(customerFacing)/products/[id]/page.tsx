import ProductGridSection from "@/components/ProductGridSection";
import { Button } from "@/components/ui/button";
import {
   Card,
   CardContent,
   CardDescription,
   CardFooter,
   CardHeader,
   CardTitle,
} from "@/components/ui/card";
import db from "@/db/db";
import { cache } from "@/lib/cache";
import { formatCurrency } from "@/lib/formatter";
import { Product } from "@prisma/client";
import { PackageSearch, Star } from "lucide-react";

import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import AddToCartButton from "../../_components/AddToCartButton";
import ProductReviewSection from "../../_components/ProductReviewSection";
import getAverageRating from "@/lib/get-average-rating";

const getRelatedProducts = cache(
   (product?: Product | null): Promise<Product[]> => {
      if (!product) return Promise.resolve([]);

      return db.product.findMany({
         where: {
            isAvailableForPurchase: true,
            OR: [
               {
                  category: {
                     equals: product.category,
                  },
               },
               {
                  name: {
                     in: product.name.split(" ").map((name) => name.toLowerCase()),
                  },
               },
            ],
            NOT: {
               id: product.id,
            },
         },
         orderBy: {
            createdAt: "desc",
         },
         take: 3,
      });
   },
   ["/", "getRelatedProducts"],
   { revalidate: 60 * 60 * 24 }
);

export default async function ProductViewPage({
   params: { id },
}: {
   params: { id: string };
}) {
   const product = await db.product.findUnique({
      where: { id },
      include: {
         productReviews: {
            select: { rating: true },
         },
      },
   });

   if (product === null) return notFound();

   const averageRating = getAverageRating(product.productReviews);

   return (
      <div className="space-y-10">
         <Card className="flex sm:flex-row flex-col overflow-hidden justify-between shadow-sm">
            <div className="relative w-3/5 h-auto aspect-video">
               <Image src={product.imagePath} alt={product.name} fill />
            </div>
            <div className="flex flex-col w-2/5">
               <div className="mb-auto">
                  <CardHeader>
                     <CardTitle className="flex space-x-2">
                        <div>{product.name}</div>

                        <div className="space-x-2 flex">
                           <Star className="fill-yellow-500" />
                           {averageRating}
                        </div>
                     </CardTitle>
                     <CardDescription>
                        {product.priceInCents === 1
                           ? "Free"
                           : formatCurrency(product.priceInCents / 100)}
                     </CardDescription>
                  </CardHeader>
                  <CardContent className="flex flex-grow">
                     <p className="line-clamp-4">{product.description}</p>
                  </CardContent>
               </div>
               <CardFooter className="mt-auto flex flex-col py-1">
                  {product.priceInCents === 1 ? (
                     // TODO : Download functionality
                     <Button
                        size="lg"
                        className="w-full bg-green-700 text-white hover:bg-green-600"
                     >
                        Download now
                     </Button>
                  ) : (
                     <div className="flex items-center flex-col">
                        <div className="flex space-x-1">
                           <Button
                              asChild
                              size="lg"
                              className="bg-green-700 text-white hover:bg-green-600"
                              variant="secondary"
                           >
                              <Link href={`/products/checkout?pid=${product.id}`}>
                                 Buy now
                              </Link>
                           </Button>
                           <AddToCartButton product={product} />
                        </div>
                     </div>
                  )}
                  <Button asChild variant="link">
                     <Link href="/products" className="text-sm">
                        Browse more products
                        <PackageSearch size={20} className="ml-2" />
                     </Link>
                  </Button>
               </CardFooter>
            </div>
         </Card>

         <ProductReviewSection product={product} />

         <ProductGridSection
            title="Related products"
            productsFetcher={getRelatedProducts.bind(null, product)}
         />
      </div>
   );
}
