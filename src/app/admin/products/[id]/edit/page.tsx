import { PageHeader } from "@/components/PageHeader";
import { ProductForm } from "../../_components/ProductForm";
import db from "@/db/db";

// here we are taking a prop called id from the object called params.
// next to it we define the type, whick is of type and its prop type id as string params: { id: string }
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
