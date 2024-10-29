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

type PurchaseReceiptEmailProps = {
   products: {
      name: string;
      imagePath: string;
      description: string;
   }[];
   orders: {
      id: string;
      createdAt: Date;
      pricePaidInCents: number;
   }[];
   downloadVerificationIds: string[];
};

PurchaseReceiptEmail.PreviewProps = {
   products: [
      {
         name: "product name",
         imagePath:
            "/products/216d97be-9f42-424b-9de5-058e03fab3d2-WhatsApp Image 2024-07-09 at 12.16.07 (2).jpeg",
         description: "product description",
      },
   ],
   orders: [
      {
         id: crypto.randomUUID(),
         createdAt: new Date(),
         pricePaidInCents: 1000,
      },
   ],
   downloadVerificationIds: [crypto.randomUUID()],
} satisfies PurchaseReceiptEmailProps;

export default function PurchaseReceiptEmail({
   products,
   orders,
   downloadVerificationIds,
}: PurchaseReceiptEmailProps) {
   return (
      <Html>
         <Preview>View receipt</Preview>
         <Tailwind>
            <Head />
            <Body className="font-sans bg-white">
               <Container className="max-w-xl">
                  <Heading>Purchase Receipt and other information</Heading>
                  {products.map((product, index) => (
                     <OrderInformation
                        key={index}
                        order={orders[index]}
                        product={product}
                        downloadVerificationId={downloadVerificationIds[index]}
                     />
                  ))}
               </Container>
            </Body>
         </Tailwind>
      </Html>
   );
}
