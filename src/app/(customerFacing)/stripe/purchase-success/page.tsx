import { Button } from "@/components/ui/button";
import db from "@/db/db";
import { formatCurrency } from "@/lib/formatter";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

type SuccessPageProp = {
   searchParams: { payment_intent: string };
};

export default async function SuccessPage({
   searchParams,
}: SuccessPageProp): Promise<JSX.Element> {
   const paymentIntent = await stripe.paymentIntents.retrieve(
      searchParams.payment_intent
   );

   if (paymentIntent.metadata.productId == null) return notFound();

   const product = await db.product.findUnique({
      where: { id: paymentIntent.metadata.productId },
   });

   if (product === null) return notFound();

   const isSuccess: boolean = paymentIntent.status === "succeeded";

   return (
      <div className="max-w-5xl w-full m-auto space-y-8">
         <h1 className="text-blue-950 text-3xl font-bold text-center">
            {isSuccess
               ? "Your purchase was successful!"
               : "Sorry, something went wrong with your purchase."}
         </h1>
         <div className="flex gap-4 items-center">
            <div className="aspect-video flex-shrink-0 w-1/3 relative">
               <Image
                  src={product.imagePath}
                  fill
                  alt={product.name}
                  className="object-cover"
               />
            </div>
            <div>
               <div className="text-lg">{formatCurrency(product.priceInCents / 100)}</div>
               <h1 className="text-2xl font-bold">{product.name}</h1>
               <div className="line-clamp-3 text-muted-foreground">
                  {product.description}
               </div>
               <Button className="mt-4" size="lg" asChild>
                  {isSuccess ? (
                     <a
                        href={`/products/download/${await createDownloadVerification(
                           product.id
                        )}`}
                     >
                        Download
                     </a>
                  ) : (
                     <Link href={`/products/${product.id}/purchase`}>Try again</Link>
                  )}
               </Button>
            </div>
         </div>
      </div>
   );
}

async function createDownloadVerification(productId: string): Promise<string> {
   return (
      await db.downloadVerification.create({
         data: {
            productId,
            expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24),
         },
      })
   ).id;
}
