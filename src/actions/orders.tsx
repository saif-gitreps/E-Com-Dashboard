"use server";

import db from "@/db/db";
import { z } from "zod";

const emailSchema = z.string().email();

export async function emailOrderHistory(
   prevState: unknown,
   formData: FormData
): Promise<{ message?: string; error?: string }> {
   const result = emailSchema.safeParse(formData.get("email"));

   if (result.success == false) {
      return { error: "Invalid email" };
   }

   const user = await db.user.findUnique({
      where: { email: result.data },
      select: {
         email: true,
         orders: {
            select: {
               pricePaidInCents: true,
               id: true,
               createdAt: true,
               product: {
                  select: {
                     id: true,
                     name: true,
                     imagePath: true,
                     description: true,
                  },
               },
            },
         },
      },
   });

   return { message: "Email sent" };
}
