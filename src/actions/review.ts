"use server";

import { getCurrentUserFromSession } from "@/app/(auth)/_actions/auth";
import db from "@/db/db";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const reviewSchema = z.object({
   rating: z.number().int().min(1).max(5),
   review: z.string().min(1).max(500),
   productId: z.string(),
});

export async function addReview(
   prevState: unknown,
   formData: FormData
): Promise<{ success?: boolean; error?: string }> {
   const result = reviewSchema.safeParse({
      rating: Number(formData.get("rating")),
      review: String(formData.get("review")),
      productId: String(formData.get("productId")),
   });

   if (result.success == false) {
      return { error: "Something went wrong, try again." };
   }

   const userData = await getCurrentUserFromSession();

   if (!userData) {
      return { error: "You must be signed-in to leave a review" };
   }

   const user = await db.user.findUnique({
      where: { id: userData?.userId as string },
   });

   await db.productReview.create({
      data: {
         rating: result.data.rating,
         review: result.data.review,
         productId: result.data.productId,
         userId: user?.id as string,
      },
   });

   revalidatePath(`/products/${result.data.productId}`);

   return { success: true };
}
