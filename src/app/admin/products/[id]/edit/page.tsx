import { PageHeader } from "@/app/admin/_components/PageHeader";
import { ProductForm } from "../../_components/ProductForm";
import db from "@/db/db";

// here we are taking a prop called id from the params object.
// next to it we definee the type, params: { id: string }
export default async function EditProductPage({
   params: { id },
}: {
   params: { id: string };
}) {
   const product = await db.product.findUnique({
      where: { id },
   });
   return (
      <>
         <PageHeader>Edit product</PageHeader>
         <ProductForm product={product} />
      </>
   );
}
