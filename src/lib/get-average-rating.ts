import { ProductReview } from "@prisma/client";

export default function getAverageRating(
   reviews: {
      rating: number;
   }[]
) {
   const averageRating = (
      reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length
   ).toPrecision(2);
   return averageRating;
}
