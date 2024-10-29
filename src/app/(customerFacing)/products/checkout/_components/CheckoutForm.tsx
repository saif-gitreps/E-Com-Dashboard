"use client";

import { userOrderExists } from "@/app/actions/orders";
import { Button } from "@/components/ui/button";
import {
   Card,
   CardContent,
   CardDescription,
   CardFooter,
   CardHeader,
   CardTitle,
} from "@/components/ui/card";
import { formatCurrency } from "@/lib/formatter";
import {
   Elements,
   LinkAuthenticationElement,
   PaymentElement,
   useElements,
   useStripe,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { FormEvent, useState } from "react";

export type ReviewProduct = {
   id: string;
   imagePath: string;
   name: string;
   priceInCents: number;
   description: string;
};

type CheckoutFormProps = {
   products: ReviewProduct[];
   clientSecret: string;
};

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY as string);

export default function CheckoutForm({ products, clientSecret }: CheckoutFormProps) {
   const [finalProducts, setFinalProducts] = useState<ReviewProduct[]>(products || []);

   return (
      <div className="max-w-5xl w-full m-auto space-y-8">
         <div className="border rounded-lg p-2 space-y-3">
            {finalProducts.length === 0 && (
               <h1 className="text-2xl text-center font-semibold my-10">
                  Your cart is empty.
                  {"  "}
                  <Link href="/" className="text-gray-500 hover:underline">
                     Browse products <ArrowRight size={20} className="inline" />
                  </Link>
               </h1>
            )}

            {finalProducts.map((product) => (
               <ProductReviewCard
                  key={product.id}
                  product={product}
                  onRemove={() =>
                     setFinalProducts(finalProducts.filter((p) => p.id !== product.id))
                  }
               />
            ))}
         </div>

         <Elements options={{ clientSecret }} stripe={stripePromise}>
            <Form products={finalProducts} />
         </Elements>
      </div>
   );
}

function ProductReviewCard({
   product,
   onRemove,
}: {
   product: ReviewProduct;
   onRemove?: () => void;
}) {
   return (
      <div className="flex flex-col sm:justify-between sm:flex-row sm:my-0 my-2">
         <div className="flex gap-10 w-5/6">
            <div className="aspect-video flex-shrink-0 w-2/4 relative">
               <Image
                  src={product.imagePath}
                  fill
                  alt={product.name}
                  className="object-cover"
               />
            </div>
            <div className="flex flex-col justify-between">
               <div>
                  <h1 className="text-2xl font-bold">{product.name}</h1>
                  <div className="line-clamp-3 text-muted-foreground">
                     {product.description}
                  </div>
               </div>

               <span aria-hidden className="w-full"></span>
               <div className="text-lg font-bold text-gray-700">
                  Price: {formatCurrency(product.priceInCents / 100)}
               </div>
            </div>
         </div>
         <Button variant="destructive" onClick={onRemove}>
            Remove
         </Button>
      </div>
   );
}

function Form({ products }: { products: ReviewProduct[] }) {
   const stripe = useStripe();
   const elements = useElements();
   const [isLoading, setIsLoading] = useState<boolean>(false);
   const [email, setEmail] = useState<string | null>();
   const [errorMessage, setErrorMessage] = useState<string | undefined>("");
   const priceInCents = products.reduce((acc, product) => {
      return acc + product.priceInCents;
   }, 0);

   const handleSubmit = async (e: FormEvent) => {
      e.preventDefault();

      if (stripe == null || elements == null || email == null) return;

      setIsLoading(true);

      let existingOrders: string[] = [];

      for (const product of products) {
         const orderExists = await userOrderExists(email, product.id);

         if (orderExists) {
            existingOrders.push(product.name);
         }
      }

      // TODO: Change every Order to Purchase history in UI.
      if (existingOrders.length > 0) {
         setErrorMessage(
            `You have already purchased these products: ${existingOrders.join(
               ", "
            )}. Check your purchase history.`
         );
         setIsLoading(false);
         return;
      }

      stripe
         .confirmPayment({
            elements,
            confirmParams: {
               return_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/stripe/purchase-success`,
            },
         })
         .then(({ error }) => {
            if (error.type == "card_error" || error.type == "validation_error") {
               setErrorMessage(error.message);
            } else {
               setErrorMessage("An unknown error occurred. Try again later.");
            }
         })
         .finally(() => {
            setIsLoading(false);
         });
   };

   return (
      <form onSubmit={handleSubmit}>
         <Card>
            <CardHeader>
               <CardTitle>Checkout</CardTitle>
               {errorMessage && (
                  <CardDescription className="text-destructive">
                     {errorMessage}
                  </CardDescription>
               )}
            </CardHeader>
            <CardContent>
               <PaymentElement />
               <div className="mt-5">
                  <LinkAuthenticationElement onChange={(e) => setEmail(e.value.email)} />
               </div>
            </CardContent>
            <CardFooter>
               <Button
                  className="w-full"
                  size="lg"
                  disabled={stripe === null || elements === null || isLoading}
               >
                  {isLoading
                     ? "Processing..."
                     : `Purchase for total of ${formatCurrency(priceInCents / 100)}`}
               </Button>
            </CardFooter>
         </Card>
      </form>
   );
}
