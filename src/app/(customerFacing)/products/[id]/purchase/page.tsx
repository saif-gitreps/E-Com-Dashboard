import db from "@/db/db";
import { notFound } from "next/navigation";

export default async function PurchasePage({
   params: { id },
}: {
   params: { id: string };
}) {
   const product = db.product.findUnique({ where: { id } });

   if (product === null) return notFound();

   return <h1>hi</h1>;
}
