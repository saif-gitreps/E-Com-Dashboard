import { PageHeader } from "@/components/PageHeader";
import db from "@/db/db";
import { useCart } from "@/hooks/use-cart";
import { notFound } from "next/navigation";
import Stripe from "stripe";
import CheckoutForm from "./_components/CheckoutForm";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

type SearchParams = {
   pid: string | string[];
};

export default async function CheckoutPage({
   searchParams,
}: {
   searchParams: SearchParams;
}) {
   const productIds = searchParams.pid;

   const ids = Array.isArray(productIds) ? productIds : [productIds];

   if (!ids || ids.length === 0) return notFound();

   const products = await db.product.findMany({
      where: {
         id: {
            in: ids,
         },
      },
   });

   if (products.length === 0) return notFound();

   for (const product of products) if (product == null) return notFound();

   const paymentIntent = await stripe.paymentIntents.create({
      amount: products.reduce((acc, product) => {
         return acc + product.priceInCents;
      }, 0),
      currency: "USD",
      metadata: {
         productIds: products.map((product) => product.id).join(","),
      },
   });

   if (paymentIntent.client_secret == null) {
      throw Error("Failure while creating stripe payment intent.");
   }

   return (
      <>
         <PageHeader>Final checkout and payment</PageHeader>
         <CheckoutForm products={products} clientSecret={paymentIntent.client_secret} />
      </>
   );
}
