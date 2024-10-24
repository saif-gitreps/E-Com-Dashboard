import AddToCartButton from "@/components/AddToCartButton";
import { PageHeader } from "@/components/PageHeader";
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
import { CreditCard } from "lucide-react";

import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

const getRelatedProducts = cache(
   (): Promise<Product[]> => {
      return db.product.findMany({
         where: {
            isAvailableForPurchase: true,
         },
         take: 3,
      });
   },
   ["/", "getNewestProducts"],
   { revalidate: 60 * 60 * 24 }
);

export default async function ProductViewPage({
   params: { id },
}: {
   params: { id: string };
}) {
   const product = await db.product.findUnique({ where: { id } });

   if (product === null) return notFound();

   return (
      <div>
         <PageHeader>{product.name}</PageHeader>

         <Card className="flex overflow-hidden justify-between flex-row shadow-sm mb-20">
            <div className="relative w-3/5 h-auto aspect-video">
               <Image src={product.imagePath} alt={product.name} fill />
            </div>
            <div className="flex flex-col w-2/5">
               <div className="mb-auto">
                  <CardHeader>
                     <CardTitle>{product.name}</CardTitle>
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
                     <>
                        <AddToCartButton product={product} />
                        <Button asChild variant="link">
                           <Link href="/products/checkout" className="text-sm">
                              Taken into cart? Proceed to checkout{" "}
                              <CreditCard size={20} className="ml-2" />
                           </Link>
                        </Button>
                     </>
                  )}
               </CardFooter>
            </div>
         </Card>

         <ProductGridSection
            title="Related products"
            productsFetcher={getRelatedProducts}
         />
      </div>
   );
}
