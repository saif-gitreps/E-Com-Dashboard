import { Suspense } from "react";
import { ProductCard, ProductCardSkeleton } from "./ProductCard";
import { Button } from "./ui/button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Product } from "@prisma/client";

type ProductGridSectionProps = {
   title: string;
   productsFetcher: () => Promise<Product[]>;
};

export default function ProductGridSection({
   productsFetcher,
   title,
}: ProductGridSectionProps) {
   return (
      <div className="space-y-4">
         <div className="flex gap-4">
            <h2 className="text-3xl font-bold">{title}</h2>
            {/* {TODO: ADD a query param as catergory, when user clicks view all, the loading product will query products related to that catoery} */}
            <Button variant="outline">
               <Link href="/products" className="flex items-center space-x-2">
                  <span>View all</span>
                  <ArrowRight className="size-4" />
               </Link>
            </Button>
         </div>
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Suspense
               fallback={
                  <>
                     <ProductCardSkeleton />
                     <ProductCardSkeleton />
                     <ProductCardSkeleton />
                  </>
               }
            >
               <ProductSuspense productsFetcher={productsFetcher} />
            </Suspense>
         </div>
      </div>
   );
}

export async function ProductSuspense({
   productsFetcher,
}: {
   productsFetcher: () => Promise<Product[]>;
}) {
   return (await productsFetcher()).map((product) => (
      <ProductCard key={product.id} product={product} />
   ));
}
