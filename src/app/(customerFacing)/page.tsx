import ProductGridSection from "@/components/ProductGridSection";
import db from "@/db/db";
import { cache } from "@/lib/cache";
import { Product } from "@prisma/client";
import { Computer, MonitorDown } from "lucide-react";
import Image from "next/image";

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
         take: 3,
      });
   },
   ["/", "getMostPopularProducts"],
   { revalidate: 60 * 5 }
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
   { revalidate: 60 * 5 }
);

export default function HomePage(): React.ReactNode {
   return (
      <main className="space-y-12">
         <LandingSection />
         <ProductGridSection
            title="Our Best Sellers"
            productsFetcher={getMostPopularProducts}
         />
         <ProductGridSection title="Latest" productsFetcher={getNewestProducts} />
      </main>
   );
}

function LandingSection() {
   return (
      <div className="">
         <MonitorDown className="w-24 h-24 mx-auto" />
         <h1 className="text-center text-3xl font-semibold">
            Welcome to <span className="font-bold text-gray-700">Assets Haven!</span>
         </h1>
         <h2 className="text-center text-xl">
            A platform to trade and download digital assets, softwares and many other
            products with ease.
         </h2>
      </div>
   );
}
