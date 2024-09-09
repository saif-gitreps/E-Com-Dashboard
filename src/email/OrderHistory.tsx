import {
   Body,
   Container,
   Head,
   Heading,
   Html,
   Preview,
   Tailwind,
} from "@react-email/components";
import { OrderInformation } from "./_components/OrderInformation";
import React from "react";

type OrderHistoryEmailProps = {
   orders: {
      id: string;
      pricePaidInCents: number;
      createdAt: Date;
      product: {
         id: string;
         name: string;
         imagePath: string;
         description: string;
      };
      downloadVerificationId: string;
   }[];
};

OrderHistoryEmail.PreviewProps = {
   orders: [
      {
         id: crypto.randomUUID(),
         createdAt: new Date(),
         pricePaidInCents: 1000,
         product: {
            id: crypto.randomUUID(),
            name: "product name",
            imagePath:
               "/products/216d97be-9f42-424b-9de5-058e03fab3d2-WhatsApp Image 2024-07-09 at 12.16.07 (2).jpeg",
            description: "product description",
         },
         downloadVerificationId: crypto.randomUUID(),
      },
      {
         id: crypto.randomUUID(),
         createdAt: new Date(),
         pricePaidInCents: 1000,
         product: {
            id: crypto.randomUUID(),
            name: "product name",
            imagePath:
               "/products/216d97be-9f42-424b-9de5-058e03fab3d2-WhatsApp Image 2024-07-09 at 12.16.07 (2).jpeg",
            description: "product description",
         },
         downloadVerificationId: crypto.randomUUID(),
      },
      {
         id: crypto.randomUUID(),
         createdAt: new Date(),
         pricePaidInCents: 1000,
         product: {
            id: crypto.randomUUID(),
            name: "product name",
            imagePath:
               "/products/216d97be-9f42-424b-9de5-058e03fab3d2-WhatsApp Image 2024-07-09 at 12.16.07 (2).jpeg",
            description: "product description",
         },
         downloadVerificationId: crypto.randomUUID(),
      },
   ],
} satisfies OrderHistoryEmailProps;

export default function OrderHistoryEmail({ orders }: OrderHistoryEmailProps) {
   return (
      <Html>
         <Preview>Order History</Preview>
         <Tailwind>
            <Head />
            <Body className="font-sans bg-white">
               <Container className="max-w-xl">
                  <Heading>Order history and other informations</Heading>
                  {orders.map((order, index) => (
                     <React.Fragment key={order.id}>
                        <OrderInformation
                           order={order}
                           product={order.product}
                           downloadVerificationId={order.downloadVerificationId}
                        />
                        {index < orders.length - 1 && <hr className="my-4" />}
                     </React.Fragment>
                  ))}
               </Container>
            </Body>
         </Tailwind>
      </Html>
   );
}
