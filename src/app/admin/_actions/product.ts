"use server";

import { z } from "zod";
import { redirect, notFound } from "next/navigation";
import { revalidatePath } from "next/cache";
import { getCurrentUserFromSession } from "@/app/(auth)/_actions/auth";
import db from "@/db/db";
import { deleteFromSupabase, uploadToSupabase } from "@/lib/supbase-storage-api";

const fileSchema = z.instanceof(File, { message: "required" });
const imageSchema = fileSchema.refine(
   (file) => file.size === 0 || file.type.startsWith("image/")
);

const addSchema = z.object({
   name: z.string().min(1),
   description: z.string().min(1),
   priceInCents: z.coerce.number().int().min(1),
   file: fileSchema.refine((file) => file.size > 0, "required"),
   image: imageSchema.refine((file) => file.size > 0, "required"),
   category: z.string().min(1).toLowerCase(),
});

export async function addProducts(prevState: unknown, formData: FormData) {
   const result = addSchema.safeParse(Object.fromEntries(formData.entries()));
   if (!result.success) {
      return result.error.formErrors.fieldErrors;
   }

   const data = result.data;
   const fileUpload = await uploadToSupabase(data.file, "product");
   const imageUpload = await uploadToSupabase(data.image, "image");

   if (!fileUpload || !imageUpload) {
      redirect("/admin/products");
   }

   const userData = await getCurrentUserFromSession();
   if (!userData?.userId) {
      return redirect("/sign-in");
   }

   await db.product.create({
      data: {
         isAvailableForPurchase: false,
         name: data.name,
         description: data.description,
         priceInCents: data.priceInCents,
         category: data.category,
         filePath: fileUpload.path,
         imagePath: imageUpload.publicUrl!,
         userId: userData.userId as string,
      },
   });

   revalidatePath("/products");
   revalidatePath("/");
   redirect("/admin/products");
}

const editSchema = addSchema.extend({
   file: fileSchema.optional(),
   image: imageSchema.optional(),
});

export async function updateProducts(id: string, prevState: unknown, formData: FormData) {
   const result = editSchema.safeParse(Object.fromEntries(formData.entries()));
   if (!result.success) {
      return result.error.formErrors.fieldErrors;
   }

   const data = result.data;
   const product = await db.product.findUnique({ where: { id } });
   if (!product) return notFound();

   let filePath = product.filePath;
   let imagePath = product.imagePath;

   if (data.file) {
      await deleteFromSupabase(product.filePath);
      const fileUpload = await uploadToSupabase(data.file, "product");
      if (fileUpload) {
         filePath = fileUpload.path;
      }
   }

   if (data.image) {
      await deleteFromSupabase(product.imagePath);
      const imageUpload = await uploadToSupabase(data.image, "image");
      if (imageUpload) {
         imagePath = imageUpload.publicUrl!;
      }
   }

   const userData = await getCurrentUserFromSession();
   if (!userData?.userId) {
      return redirect("/sign-in");
   }

   await db.product.update({
      where: { id },
      data: {
         name: data.name,
         description: data.description,
         priceInCents: data.priceInCents,
         category: data.category,
         filePath,
         imagePath,
      },
   });

   revalidatePath("/products");
   revalidatePath("/");
   redirect("/admin/products");
}

export async function deleteProduct(id: string) {
   const product = await db.product.delete({ where: { id } });

   if (product === null) return notFound();

   await deleteFromSupabase(product.filePath);
   await deleteFromSupabase(product.imagePath);

   revalidatePath("/products");
   revalidatePath("/");
}

export async function toggleProductAvailability(
   id: string,
   isAvailableForPurchase: boolean
) {
   await db.product.update({
      where: { id },
      data: {
         isAvailableForPurchase,
      },
   });

   revalidatePath("/products");
   revalidatePath("/");
}

export async function toggleProductApproval(id: string) {
   await db.product.update({
      where: { id },
      data: {
         isApprovedByAdmin: true,
      },
   });

   revalidatePath("/products");
   revalidatePath("/");
}
