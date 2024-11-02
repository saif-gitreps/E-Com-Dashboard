import { ProductCard, ProductCardSkeleton } from "@/components/ProductCard";
import db from "@/db/db";
import { cache } from "@/lib/cache";
import { Product } from "@prisma/client";
import { Suspense } from "react";
import FilterOptions from "../_components/FilterOptions";

const getProducts = cache(
   (): Promise<Product[]> => {
      return db.product.findMany({
         where: {
            isAvailableForPurchase: true,
         },
         orderBy: {
            name: "asc",
         },
      });
   },
   ["/products", "getProducts"],
   {
      revalidate: 60 * 60 * 5,
   }
);

type pageParams = {
   category: string;
   page: string;
   orderByPrice: string;
   orderByRating: string;
   orderByDate: string;
   orderBySales: string;
};

export default function ProductPage({ params }: { params: pageParams }) {
   return (
      <div className="space-y-2">
         <FilterOptions />
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Suspense
               fallback={
                  <>
                     <ProductCardSkeleton />
                     <ProductCardSkeleton />
                     <ProductCardSkeleton />
                     <ProductCardSkeleton />
                     <ProductCardSkeleton />
                     <ProductCardSkeleton />
                  </>
               }
            >
               <ProductsSuspense />
            </Suspense>
         </div>
      </div>
   );
}

async function ProductsSuspense() {
   const products = await getProducts();
   return products.map((product) => <ProductCard key={product.id} product={product} />);
}
