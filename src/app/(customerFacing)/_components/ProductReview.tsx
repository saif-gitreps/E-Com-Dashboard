"use client";

import formatDate from "@/utils/format-date";

export type ProductReviewCompProps = {
   productReview: {
      id: string;
      rating: number;
      review: string;
      createdAt: Date;
      user: {
         email: string;
      };
   };
};

export default function ProductReviewComp({ productReview }: ProductReviewCompProps) {
   const hashEmail = (email: string) => {
      for (let i = 3; i < email.length && email[i] !== "@"; i++) {
         email = email.replace(email[i], "*");
      }
      return email;
   };

   return (
      <div className="w-full p-2 border-b border-gray-200">
         <div className="flex justify-between mb-1">
            <div className="text-gray-600 font-semibold flex text-sm">
               <p>{hashEmail(productReview.user.email)}</p>

               <p className="text-yellow-500 font-bold ml-2">
                  {"★".repeat(productReview.rating)}
               </p>
            </div>
            <p className="text-gray-800 italic text-xs">
               {formatDate(productReview.createdAt)}
            </p>
         </div>

         <p className="text-gray-700">{productReview.review}</p>
      </div>
   );
}

export function ProductReviewSkeleton() {
   return (
      <div className="w-full p-2 border-b border-gray-200">
         <div className="flex justify-between mb-1">
            <p className="bg-gray-200 w-24 h-5 rounded animate-pulse"></p>
            <p className="bg-gray-200 w-20 h-5 rounded animate-pulse"></p>
         </div>
         <h2 className="bg-gray-200 w-12 h-6 rounded animate-pulse mb-2"></h2>
         <p className="bg-gray-100 w-full h-4 rounded animate-pulse mb-1"></p>
         <p className="bg-gray-100 w-5/6 h-4 rounded animate-pulse mb-1"></p>
         <p className="bg-gray-100 w-2/3 h-4 rounded animate-pulse"></p>
      </div>
   );
}
