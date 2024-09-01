import db from "@/db/db";
import { notFound } from "next/navigation";
import Stripe from "stripe";
import CheckoutForm from "./_components/CheckoutForm";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

export default async function PurchasePage({
   params: { id },
}: {
   params: { id: string };
}) {
   const product = await db.product.findUnique({ where: { id } });

   if (product === null) return notFound();

   const paymentIntent = await stripe.paymentIntents.create({
      amount: product.priceInCents,
      currency: "USD",
      metadata: {
         productId: product.id,
      },
   });

   // client secret is id for this payment intent
   if (paymentIntent.client_secret == null) {
      throw Error("Failure while creating stripe payment intent.");
   }

   return <CheckoutForm product={product} clientSecret={paymentIntent.client_secret} />;
}