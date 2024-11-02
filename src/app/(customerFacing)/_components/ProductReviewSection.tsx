import db from "@/db/db";
import { Product } from "@prisma/client";
import { Suspense } from "react";
import { cache } from "@/lib/cache";
import ProductReviewComp, {
   ProductReviewCompProps,
   ProductReviewSkeleton,
} from "./ProductReview";
import ProductReviewForm from "./ProductReviewForm";

type ProductReviewSectionProps = {
   product: Product;
};

export default function ProductReviewSection({ product }: ProductReviewSectionProps) {
   return (
      <div className="space-y-4">
         <h2 className="text-3xl font-bold">Product review and ratings</h2>
         <div className="flex flex-col">
            <Suspense
               fallback={
                  <>
                     <ProductReviewSkeleton />
                     <ProductReviewSkeleton />
                     <ProductReviewSkeleton />
                  </>
               }
            >
               <ProductReviewSuspense product={product} />
            </Suspense>
         </div>

         <ProductReviewForm productId={product.id} />
      </div>
   );
}

const getReviews = cache(
   // the type is from the ProductReviewCompProps because thats all I want.
   (product: Product): Promise<ProductReviewCompProps["productReview"][]> => {
      return db.productReview.findMany({
         where: {
            productId: product.id,
         },
         orderBy: {
            createdAt: "desc",
         },
         select: {
            id: true,
            rating: true,
            review: true,
            createdAt: true,
            user: {
               select: {
                  email: true,
               },
            },
         },
      });
   },
   ["getReviews"],
   { revalidate: 60 * 60 * 10 }
);

export async function ProductReviewSuspense({ product }: { product: Product }) {
   const reviews = await getReviews(product);

   if (reviews.length === 0) {
      return <p>No reviews yet</p>;
   }

   return reviews.map((review) => (
      <ProductReviewComp key={review.id} productReview={review} />
   ));
}
