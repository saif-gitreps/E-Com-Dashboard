import { formatCurrency } from "@/lib/formatter";
import { Button, Column, Img, Row, Section, Text } from "@react-email/components";
require("dotenv").config();

type orderInformationProps = {
   order: {
      id: string;
      createdAt: Date;
      pricePaidInCents: number;
   };
   product: {
      name: string;
      imagePath: string;
      description: string;
   };
   downloadVerificationId: string;
};

const dateFormatter = new Intl.DateTimeFormat("en", {
   dateStyle: "medium",
   timeStyle: "short",
});

export function OrderInformation({
   order,
   product,
   downloadVerificationId,
}: orderInformationProps) {
   return (
      <Section className="border border-solid border-gray-500 rounded-lg p-4 md:p-6 my-4">
         <Section className="">
            <Row>
               <Column>
                  <Text className="mb-0 text-gray-500 whitespace-nowrap text-nowrap mr-4">
                     Order ID
                  </Text>
                  <Text className="mt-0 mr-4">{order.id}</Text>
               </Column>
               <Column>
                  <Text className="mb-0 text-gray-500 whitespace-nowrap text-nowrap mr-4">
                     Purchase date
                  </Text>
                  <Text className="mt-0 mr-4">
                     {dateFormatter.format(order.createdAt)}
                  </Text>
               </Column>
               <Column>
                  <Text className="mb-0 text-gray-500 whitespace-nowrap text-nowrap mr-4">
                     Price paid
                  </Text>
                  <Text className="mt-0 mr-4">
                     {formatCurrency(order.pricePaidInCents / 100)}
                  </Text>
               </Column>
            </Row>
         </Section>
         <Section>
            <Img
               width="100%"
               alt={product.name}
               src={`${process.env.NEXT_PUBLIC_SERVER_URL}${product.imagePath}`}
            />
            <Row className="mt-8 ">
               <Column align="left">
                  <Text className="text-lg font-bold m-0 mr-4">{product.name}</Text>
               </Column>
               <Column align="right">
                  <Button
                     className="bg-black text-white px-4 py-2 rounded-md text-lg "
                     href={`${process.env.NEXT_PUBLIC_SERVER_UR}/products/download/${downloadVerificationId}`}
                  >
                     Download
                  </Button>
               </Column>
            </Row>
            <Row>
               <Column>
                  <Text className="mb-0">{product.description}</Text>
               </Column>
            </Row>
         </Section>
      </Section>
   );
}
