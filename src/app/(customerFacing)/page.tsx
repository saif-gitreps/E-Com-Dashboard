import ProductGridSection from "@/components/ProductGridSection";
import db from "@/db/db";
import { cache } from "@/lib/cache";
import { Product } from "@prisma/client";

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

export default function HomePage(): React.ReactNode {
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
