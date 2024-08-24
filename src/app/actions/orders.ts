"use server";

import db from "@/db/db";

export async function userOrderExists(email: string, productId: string) {
   return (
      (await db.order.findFirst({
         where: { user: { email: email }, productId: productId },
         select: { id: true }, // selecting just id since all we need to know is if it exists.
      })) != null
   );
}
