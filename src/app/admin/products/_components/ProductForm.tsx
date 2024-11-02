"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { formatCurrency } from "@/lib/formatter";
import { useEffect, useState } from "react";
import { addProducts, updateProducts } from "../../_actions/product";
import { useFormState, useFormStatus } from "react-dom";
import { Product } from "@prisma/client";
import Image from "next/image";
import { getCurrentUserFromSession } from "@/app/(auth)/_actions/auth";
import SpinLoader from "@/components/SpinLoader";
import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from "@/components/ui/select";

export function ProductForm({ product }: { product?: Product | null }) {
   const [error, action] = useFormState(
      product == null ? addProducts : updateProducts.bind(null, product.id),
      {}
   );

   const [priceInCents, setPriceInCents] = useState<number | undefined>(
      product?.priceInCents
   );

   const categories = [
      "icons",
      "themes",
      "fonts",
      "logos",
      "photos",
      "web-templates",
      "digtal-arts",
      "books",
      "study-materials",
      "pdf",
      "games",
      "softwares",
   ];

   return (
      <form className="space-y-8" action={action}>
         <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
               type="text"
               id="name"
               name="name"
               required
               defaultValue={product?.name}
            />

            {error.name && <div className="text-destructive">{error.name}</div>}
         </div>

         <div className="space-y-2">
            <Label htmlFor="priceInCents">Price in cents</Label>

            <Input
               type="number"
               id="priceInCents"
               name="priceInCents"
               required
               value={priceInCents}
               defaultValue={product?.priceInCents}
               onChange={(e) => setPriceInCents(Number(e.target.value) || undefined)}
            />

            <div className="text-muted-foreground">
               {formatCurrency((priceInCents || 0) / 100)}
            </div>

            {error.priceInCents && (
               <div className="text-destructive">{error.priceInCents}</div>
            )}
         </div>

         <div className="space-y-2">
            <Label htmlFor="description">Description</Label>

            <Textarea
               id="description"
               name="description"
               required
               defaultValue={product?.description}
            />

            {error.description && (
               <div className="text-destructive">{error.description}</div>
            )}
         </div>

         <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select defaultValue={product?.category} name="category" required>
               <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a category" />
               </SelectTrigger>
               <SelectContent>
                  {categories.map((category) => (
                     <SelectItem key={category} value={category}>
                        {category}
                     </SelectItem>
                  ))}
               </SelectContent>
            </Select>

            {error.category && <div className="text-destructive">{error.category}</div>}
         </div>

         <div className="space-y-2">
            <Label htmlFor="file">File</Label>

            <Input type="file" id="file" name="file" required={product === null} />

            {product != null && (
               <div className="text-muted-foreground">{product?.filePath}</div>
            )}

            {error.file && <div className="text-destructive">{error.file}</div>}
         </div>

         <div className="space-y-2">
            <Label htmlFor="image">Image</Label>

            <Input
               type="file"
               id="image"
               name="image"
               required={product === null}
               src={product?.imagePath}
            />

            {product != null && (
               <Image
                  src={product.imagePath}
                  alt={product.name}
                  height="300"
                  width="300"
               />
            )}

            {error.image && <div className="text-destructive">{error.image}</div>}
         </div>
         <SubmitButton />
      </form>
   );
}

function SubmitButton() {
   const { pending } = useFormStatus();
   return (
      <Button type="submit" disabled={pending}>
         {pending ? <SpinLoader>Saving..</SpinLoader> : "save"}
      </Button>
   );
}
