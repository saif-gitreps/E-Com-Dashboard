import { ProductCard, ProductCardSkeleton } from "@/components/ProductCard";
import db from "@/db/db";
import { cache } from "@/lib/cache";
import { Product } from "@prisma/client";
import { Suspense } from "react";
import FilterOptions from "../_components/FilterOptions";
import { Button } from "@/components/ui/button";

const ITEMS_PER_PAGE = 3;

const getProducts = cache(
   async (searchParams: {
      category?: string;
      page?: string;
      orderByPrice?: string;
      orderByRating?: string;
      orderByDate?: string;
      orderBySales?: string;
   }): Promise<{ products: Product[]; total: number }> => {
      const page = Number(searchParams.page) || 1;
      const skip = (page - 1) * ITEMS_PER_PAGE;

      const where: any = {
         isAvailableForPurchase: true,
      };

      if (searchParams.category && searchParams.category !== "All") {
         where.category = searchParams.category;
      }

      let orderBy: any[] = [];

      if (searchParams.orderByPrice) {
         orderBy.push({ priceInCents: searchParams.orderByPrice });
      }

      if (searchParams.orderByDate) {
         orderBy.push({ createdAt: searchParams.orderByDate });
      }

      // TODO: Compelte the orderbyRating and orderBysales logic.

      // if (searchParams.orderByRating) {
      //    orderBy.push({ rating: searchParams.orderByRating });
      // }

      // if (searchParams.orderBySales) {
      //    orderBy.push({ totalSales: searchParams.orderBySales });
      // }

      if (orderBy.length === 0) {
         orderBy.push({ name: "asc" });
      }

      const [products, total] = await Promise.all([
         db.product.findMany({
            where,
            orderBy,
            take: ITEMS_PER_PAGE,
            skip,
         }),
         db.product.count({ where }),
      ]);

      return { products, total };
   },
   ["/products", "getProducts"],
   {
      revalidate: 60 * 60 * 5,
   }
);

type PageProps = {
   searchParams: {
      category?: string;
      page?: string;
      orderByPrice?: string;
      orderByRating?: string;
      orderByDate?: string;
      orderBySales?: string;
   };
};

export default function ProductPage({ searchParams }: PageProps) {
   return (
      <div className="space-y-4">
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
               <ProductsSuspense searchParams={searchParams} />
            </Suspense>
         </div>
      </div>
   );
}

async function ProductsSuspense({ searchParams }: PageProps) {
   const { products, total } = await getProducts(searchParams);
   const currentPage = Number(searchParams.page) || 1;
   const totalPages = Math.ceil(total / ITEMS_PER_PAGE);

   return (
      <>
         {products.map((product) => (
            <ProductCard key={product.id} product={product} />
         ))}

         {/* Pagination Controls */}
         <div className="col-span-full flex justify-center items-center gap-4 mt-8">
            <PaginationControls
               currentPage={currentPage}
               totalPages={totalPages}
               searchParams={searchParams}
            />
         </div>
      </>
   );
}

function PaginationControls({
   currentPage,
   totalPages,
   searchParams,
}: {
   currentPage: number;
   totalPages: number;
   searchParams: PageProps["searchParams"];
}) {
   // Create new URLSearchParams object and remove page parameter
   const params = new URLSearchParams();
   Object.entries(searchParams).forEach(([key, value]) => {
      if (key !== "page" && value) {
         params.set(key, value);
      }
   });

   const createPageUrl = (pageNum: number) => {
      params.set("page", pageNum.toString());
      return `?${params.toString()}`;
   };

   return (
      <div className="flex gap-2">
         <Button variant="outline" disabled={currentPage <= 1} asChild>
            <a href={createPageUrl(currentPage - 1)}>Previous</a>
         </Button>

         <span className="flex items-center px-4">
            Page {currentPage} of {totalPages}
         </span>

         <Button variant="outline" disabled={currentPage >= totalPages} asChild>
            <a href={createPageUrl(currentPage + 1)}>Next</a>
         </Button>
      </div>
   );
}
