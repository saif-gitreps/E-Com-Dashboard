export default function getAverageRating(
   reviews?: {
      rating: number;
   }[],
   calculatedAverage?: number
): string {
   if (calculatedAverage) return calculatedAverage.toPrecision(2);

   if (reviews?.length === 0 || !reviews) return "0";

   let sum: number = 0;

   for (let i = 0; i < reviews.length; i++) {
      sum += reviews[i].rating;
   }

   return (sum / reviews.length).toPrecision(2);
}
