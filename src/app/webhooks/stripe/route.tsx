import db from "@/db/db";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { Resend } from "resend";
import PurchaseReceiptEmail from "@/email/PurchaseReceipt";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);
const resend = new Resend(process.env.RESEND_API_KEY as string);

export async function POST(req: NextRequest) {
   const event = await stripe.webhooks.constructEvent(
      await req.text(),
      req.headers.get("stripe-signature") as string,
      process.env.STRIPE_WEBHOOK_SECRET as string
   );

   if (event.type === "charge.succeeded") {
      const charge = event.data.object;
      const productIds = charge.metadata.productIds;
      const email = charge.billing_details.email;
      const pricePaidInCents = charge.amount;

      // const product = await db.product.findUnique({
      //    where: { id: productId },
      // });

      const products = await db.product.findMany({
         where: {
            id: {
               in: productIds.split(","),
            },
         },
      });

      if (products.length == 0 || email == null)
         return new NextResponse("Bad request", { status: 400 });

      // const userField = {
      //    email,
      //    password: "defaultPassword", // You should replace this with a secure password generation logic
      //    orders: {
      //       create: products.map((product) => ({
      //          productId: product.id,
      //          pricePaidInCents: product.priceInCents,
      //       })),
      //    },
      // };

      const { orders } = await db.user.update({
         where: { email },
         data: {
            orders: {
               create: products.map((product) => ({
                  productId: product.id,
                  pricePaidInCents: product.priceInCents,
               })),
            },
         },
         select: { orders: { orderBy: { createdAt: "desc" } } },
      });

      const downloadVerifications = await Promise.all(
         orders.map((order) =>
            db.downloadVerification.create({
               data: {
                  productId: order.productId,
                  expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24),
               },
            })
         )
      );

      // TODO: need to replace this with a dyanmic email from different admins.
      await resend.emails.send({
         from: `Support <${process.env.SENDER_EMAIL as string}>`,
         to: [email],
         subject: "Order confirmation",
         react: (
            <PurchaseReceiptEmail
               orders={orders}
               products={products}
               downloadVerificationIds={downloadVerifications.map((dv) => dv.id)}
            />
         ),
      });
   }

   return new NextResponse();
}
