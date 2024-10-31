"use client";

import { useEffect, useRef, useState } from "react";
import { Textarea } from "./ui/textarea";
import { Star } from "lucide-react";
import { Button } from "./ui/button";
import { useFormState, useFormStatus } from "react-dom";
import { addReview } from "@/actions/review";
import SpinLoader from "./SpinLoader";

export default function ProductReviewForm({ productId }: { productId: string }) {
   const [rating, setRating] = useState(0);
   const formRef = useRef<HTMLFormElement>(null);
   const [data, action] = useFormState(addReview, {});

   useEffect(() => {
      if (data?.success && formRef.current) {
         formRef.current.reset();
         setRating(0);
      }
   }, [data?.success]);

   return (
      <div className="mt-5 space-y-4 border p-3 rounded">
         <h2 className="text-lg font-medium">
            Bought the product? Drop a review and rate it!
         </h2>
         <form action={action} className="flex flex-col gap-4" ref={formRef}>
            <div className="space-y-2">
               <StarRating value={rating} onChange={setRating} />
               <input type="hidden" name="rating" value={rating} required />
            </div>

            <input
               type="hidden"
               name="productId"
               value={productId}
               required
               className="hidden"
            />

            <div className="space-y-2">
               <Textarea
                  id="review"
                  name="review"
                  placeholder="Write your review here..."
                  required
               />
            </div>

            {data?.error && <p className="text-red-500">{data?.error}</p>}

            <SubmitButton rating={rating} />
         </form>
      </div>
   );
}

function SubmitButton({ rating }: { rating: number }) {
   const { pending } = useFormStatus();
   return (
      <Button type="submit" disabled={pending || rating == 0}>
         {pending ? <SpinLoader>Adding..</SpinLoader> : "Add Review"}
      </Button>
   );
}

function StarRating({
   value,
   onChange,
}: {
   value: number;
   onChange: (value: number) => void;
}) {
   const [hover, setHover] = useState(0);

   return (
      <div className="flex items-center gap-1">
         {[1, 2, 3, 4, 5].map((star) => (
            <button
               key={star}
               type="button"
               className="relative p-1 transition-all duration-100 hover:scale-110"
               onClick={() => onChange(star)}
               onMouseEnter={() => setHover(star)}
               onMouseLeave={() => setHover(0)}
            >
               <Star
                  size={18}
                  className={`transition-colors duration-200 ${
                     star <= (hover || value)
                        ? "fill-yellow-400 text-yellow-400"
                        : "fill-gray-200 text-gray-200"
                  }`}
               />
            </button>
         ))}
         {value > 0 && (
            <span className="ml-2 text-sm text-gray-600">
               {value} star{value !== 1 ? "s" : ""}
            </span>
         )}
      </div>
   );
}
