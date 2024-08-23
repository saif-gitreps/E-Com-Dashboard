"use server";

import db from "@/db/db";
import { z } from "zod";
import fs from "fs/promises";
import { notFound, redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

const fileSchema = z.instanceof(File, { message: "required" });
// if file size is 0 then, the other part of Or will not be triggered, the condition will be passed to next refine check.
// if file size is !0 then we check if the file type is image or not.
const imageSchema = fileSchema.refine(
   (file) => file.size === 0 || file.type.startsWith("image/")
);

const addSchema = z.object({
   name: z.string().min(1),
   description: z.string().min(1),
   priceInCents: z.coerce.number().int().min(1),
   file: fileSchema.refine((file) => file.size > 0, "required"),
   image: imageSchema.refine((file) => file.size > 0, "required"),
});

export async function addProducts(prevState: unknown, formData: FormData) {
   const result = addSchema.safeParse(Object.fromEntries(formData.entries()));
   if (!result.success) {
      return result.error.formErrors.fieldErrors;
   }

   const data = result.data;

   await fs.mkdir("products", { recursive: true });
   const filePath = `products/${crypto.randomUUID()}-${data.file.name}`;
   await fs.writeFile(filePath, Buffer.from(await data.file.arrayBuffer()));

   await fs.mkdir("public/products", { recursive: true });
   const imagePath = `/products/${crypto.randomUUID()}-${data.image.name}`;
   await fs.writeFile(`public${imagePath}`, Buffer.from(await data.image.arrayBuffer()));

   await db.product.create({
      data: {
         isAvailableForPurchase: false,
         name: data.name,
         description: data.description,
         priceInCents: data.priceInCents,
         filePath,
         imagePath,
      },
   });

   // any changes done by the admin will revalidate the cache.
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

   if (product === null) return notFound();

   let filePath = product.filePath;
   if (data.file != null && data.file.size > 0) {
      await fs.unlink(product.filePath);
      filePath = `products/${crypto.randomUUID()}-${data.file.name}`;
      await fs.writeFile(filePath, Buffer.from(await data.file.arrayBuffer()));
   }

   let imagePath = product.imagePath;
   if (data.image != null && data.image.size > 0) {
      await fs.unlink(`public${product.imagePath}`);
      imagePath = `/products/${crypto.randomUUID()}-${data.image.name}`;
      await fs.writeFile(
         `public${imagePath}`,
         Buffer.from(await data.image.arrayBuffer())
      );
   }

   await db.product.update({
      where: { id },
      data: {
         name: data.name,
         description: data.description,
         priceInCents: data.priceInCents,
         filePath,
         imagePath,
      },
   });

   revalidatePath("/products");
   revalidatePath("/");

   redirect("/admin/products");
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

export async function deleteProduct(id: string) {
   const product = await db.product.delete({ where: { id } });

   if (product === null) return notFound();

   await fs.unlink(product.filePath);
   await fs.unlink(`public${product.imagePath}`); // not adding / after public, because it is already added in imagePath.

   revalidatePath("/products");
   revalidatePath("/");
}
