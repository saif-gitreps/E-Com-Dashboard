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
   product: {
      name: string;
      imagePath: string;
   };
   order: {
      id: string;
      createdAt: Date;
      pricePaidInCents: number;
   };
   downloadVerificationId: string;
};

PurchaseReceiptEmail.PreviewProps = {
   product: {
      name: "product name",
      imagePath:
         "/products/216d97be-9f42-424b-9de5-058e03fab3d2-WhatsApp Image 2024-07-09 at 12.16.07 (2).jpeg",
   },
   order: {
      id: crypto.randomUUID(),
      createdAt: new Date(),
      pricePaidInCents: 1000,
   },
   downloadVerificationId: crypto.randomUUID(),
} satisfies PurchaseReceiptEmailProps;

export default function PurchaseReceiptEmail({
   product,
   order,
   downloadVerificationId,
}: PurchaseReceiptEmailProps) {
   return (
      <Html>
         <Preview>Download {product.name} and view receipt</Preview>
         <Tailwind>
            <Head />
            <Body className="font-sans bg-white">
               <Container className="max-w-xl">
                  <Heading>Purchase Receipt</Heading>
                  <OrderInformation
                     order={order}
                     product={product}
                     downloadVerification={downloadVerificationId}
                  />
               </Container>
            </Body>
         </Tailwind>
      </Html>
   );
}
