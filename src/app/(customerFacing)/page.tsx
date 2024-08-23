import { ProductCard, ProductCardSkeleton } from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import db from "@/db/db";
import { cache } from "@/lib/cache";
import { Product } from "@prisma/client";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";

const getMostPopularProducts = cache(
   (): Promise<Product[]> => {
      return db.product.findMany({
         where: {
            isAvailableForPurchase: true,
         },
         orderBy: {
            orders: {
               _count: "desc", // we get the products that has the most amount of orders
            },
         },
         take: 6,
      });
   },
   ["/", "getMostPopularProducts"],
   { revalidate: 60 * 60 * 24 }
);

const getNewestProducts = cache(
   (): Promise<Product[]> => {
      return db.product.findMany({
         where: {
            isAvailableForPurchase: true,
         },
         orderBy: {
            createdAt: "desc",
         },
         take: 6,
      });
   },
   ["/", "getNewestProducts"],
   { revalidate: 60 * 60 * 24 }
);

export default function HomePage() {
   return (
      <main className="space-y-12">
         <ProductGridSection
            title="Most popular"
            productsFetcher={getMostPopularProducts}
         />
         <ProductGridSection title="Newest" productsFetcher={getNewestProducts} />
      </main>
   );
}

type ProductGridSectionProps = {
   title: string;
   productsFetcher: () => Promise<Product[]>;
};

function ProductGridSection({ productsFetcher, title }: ProductGridSectionProps) {
   return (
      <div className="space-y-4">
         <div className="flex gap-4">
            <h2 className="text-3xl font-bold">{title}</h2>
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

async function ProductSuspense({
   productsFetcher,
}: {
   productsFetcher: () => Promise<Product[]>;
}) {
   return (await productsFetcher()).map((product) => (
      <ProductCard key={product.id} {...product} />
   ));
}
