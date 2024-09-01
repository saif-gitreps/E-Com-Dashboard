import { formatCurrency } from "@/lib/formatter";
import { Column, Img, Row, Section, Text } from "@react-email/components";

type orderInformationProps = {
   order: {
      id: string;
      createdAt: Date;
      pricePaidInCents: number;
   };
   product: {
      name: string;
      imagePath: string;
   };
   downloadVerification: string;
   serverUrl: string;
};

const dateFormatter = new Intl.DateTimeFormat("en", {
   dateStyle: "medium",
   timeStyle: "short",
});

export function OrderInformation({
   order,
   product,
   downloadVerification,
   serverUrl,
}: orderInformationProps) {
   return (
      <>
         <Section>
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
                     {formatCurrency(order.pricePaidInCents)}
                  </Text>
               </Column>
            </Row>
         </Section>
         <Section className="border-solid border-gray-500 rounded-lg p-4 md:p-6 ny-4">
            <Img src={`${serverUrl}${product.imagePath}`} />
         </Section>
      </>
   );
}
