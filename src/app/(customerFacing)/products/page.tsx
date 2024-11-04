import { ProductCard, ProductCardSkeleton } from "@/components/ProductCard";
import db from "@/db/db";
import { cache } from "@/lib/cache";
import { Product } from "@prisma/client";
import { Suspense } from "react";
import FilterOptions from "../_components/FilterOptions";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/PageHeader";

const ITEMS_PER_PAGE = 3;

type SearchParams = {
   category?: string;
   page?: string;
   orderByPrice?: string;
   orderByRating?: string;
   orderByDate?: string;
   orderBySales?: string;
   searchQuery?: string;
};

const getProducts = cache(
   async (
      searchParams: SearchParams
   ): Promise<{ products: Product[]; total: number }> => {
      const page = Number(searchParams.page) || 1;
      const skip = (page - 1) * ITEMS_PER_PAGE;

      const where: any = {
         isAvailableForPurchase: true,
         name: {
            contains: searchParams.searchQuery,
            mode: "insensitive",
         },
         category: {
            contains: searchParams.category,
            mode: "insensitive",
         },
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
      //    orderBy.push({
      //       productReviews: {
      //          _avg: {
      //             rating: searchParams.orderByRating,
      //          },
      //       },
      //    });
      // }

      // // For the orders/sales ordering, you'll need to use _count with specific syntax
      // if (searchParams.orderBySales) {
      //    orderBy.push({
      //       orders: {
      //          _count: {
      //             _all: searchParams.orderBySales,
      //          },
      //       },
      //    });
      // }

      if (orderBy.length === 0) {
         orderBy.push({ name: "asc" });
      }

      const [products, total] = await Promise.all([
         db.product.findMany({
            where: {
               isAvailableForPurchase: true,
               OR: [
                  { name: { contains: searchParams.searchQuery, mode: "insensitive" } },
                  {
                     description: {
                        contains: searchParams.searchQuery,
                        mode: "insensitive",
                     },
                  },
               ],
            },
            include: {
               productReviews: {
                  select: {
                     rating: true,
                  },
               },
               orders: {
                  select: {
                     id: true,
                  },
               },
            },
            orderBy,
            take: ITEMS_PER_PAGE,
            skip,
            // select: {
            //    id: true,
            //    name: true,
            //    priceInCents: true,
            //    description: true,
            //    category: true,
            //    isAvailableForPurchase: true,
            //    createdAt: true,
            //    updatedAt: true,
            //    userId: true,
            //    filePath: true,
            //    imagePath: true,
            // },
         }),
         db.product.count({ where }),
      ]);

      console.log(products);

      return { products, total };
   },
   ["/products", "getProducts"],
   {
      revalidate: 60 * 60 * 5,
   }
);

type ProductPageProps = {
   searchParams: {
      category?: string;
      page?: string;
      orderByPrice?: string;
      orderByRating?: string;
      orderByDate?: string;
      orderBySales?: string;
      searchQuery?: string;
   };
};

export default function ProductPage({ searchParams }: ProductPageProps) {
   return (
      <div className="space-y-4">
         {searchParams.searchQuery && (
            <PageHeader className="text-center">
               Search results for:{" "}
               <span className="italic font-semibold">{searchParams.searchQuery}</span>
            </PageHeader>
         )}

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

async function ProductsSuspense({ searchParams }: ProductPageProps) {
   const { products, total } = await getProducts(searchParams);
   const currentPage = Number(searchParams.page) || 1;
   const totalPages = Math.ceil(total / ITEMS_PER_PAGE);

   return (
      <>
         {products.map((product) => (
            <ProductCard key={product.id} product={product} />
         ))}

         <div className="col-span-full flex flex-col justify-center items-center gap-4 mt-8">
            {products.length === 0 && <p className="text-center">No products.</p>}

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
   searchParams: ProductPageProps["searchParams"];
}) {
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
