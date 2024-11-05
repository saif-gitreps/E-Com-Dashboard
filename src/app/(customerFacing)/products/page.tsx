import { ProductCard, ProductCardSkeleton } from "@/components/ProductCard";
import { Suspense } from "react";
import FilterOptions from "../_components/FilterOptions";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/PageHeader";
import { getProducts } from "@/actions/products";

const ITEMS_PER_PAGE = 3;

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
            <ProductCard
               key={product.id}
               product={product}
               averageRating={product.averageRating}
            />
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
