import {
   Card,
   CardContent,
   CardDescription,
   CardHeader,
   CardTitle,
} from "@/components/ui/card";
import db from "@/db/db";
import { formatCurrency, formatNumber } from "@/lib/formatter";
import { getCurrentUserFromSession } from "../(auth)/_actions/auth";
import { redirect } from "next/navigation";

async function getSalesData(userId: string, isAdmin: boolean) {
   const where: any = {};

   if (!isAdmin) {
      where.userId = userId;
   }

   const data = await db?.order.aggregate({
      _sum: { pricePaidInCents: true },
      _count: true,
      where,
   });

   return {
      amount: (data._sum.pricePaidInCents || 0) / 100,
      numberOfSales: data._count,
   };
}

async function getUserData(userId: string, isAdmin: boolean) {
   const where: any = {};

   if (!isAdmin) {
      where.userId = userId;
   }

   const [userCount, orderData] = await Promise.all([
      db?.user.count({ where: { id: userId } }),
      db?.order.aggregate({
         _sum: { pricePaidInCents: true },
         where,
      }),
   ]);

   return {
      userCount,
      averageValuePerUser:
         userCount === 0 ? 0 : (orderData._sum.pricePaidInCents || 0) / userCount / 100,
   };
}

async function getProductData(userId: string, isAdmin: boolean) {
   const where: any = {};

   if (!isAdmin) {
      where.userId = userId;
   }

   const [activeCount, inactiveCount] = await Promise.all([
      db.product.count({
         where: {
            ...where,
            isAvailableForPurchase: true,
         },
      }),
      db.product.count({
         where: {
            ...where,
            isAvailableForPurchase: false,
         },
      }),
   ]);

   return {
      activeCount,
      inactiveCount,
   };
}

export default async function AdminDashboard() {
   const user = await getCurrentUserFromSession();

   const isAdmin = user?.role === "admin";

   if (!user?.userId) {
      redirect("/sign-in");
   }

   const [salesData, userData, productData] = await Promise.all([
      getSalesData(user?.userId as string, isAdmin),
      getUserData(user?.userId as string, isAdmin),
      getProductData(user?.userId as string, isAdmin),
   ]);

   return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
         <DashboardCard
            title={isAdmin ? "All Sales" : "My Sales"}
            subtitle={`${formatNumber(salesData.numberOfSales)} Orders`}
            body={formatCurrency(salesData.amount)}
         />
         <DashboardCard
            title={isAdmin ? "All Users" : "Customers"}
            subtitle={`${formatNumber(userData.averageValuePerUser)} Average sales`}
            body={formatNumber(userData.userCount)}
         />
         <DashboardCard
            title="Active Products"
            subtitle={`${formatNumber(productData.inactiveCount)} Inactive`}
            body={formatNumber(productData.activeCount)}
         />
      </div>
   );
}

type DashboardCardProps = {
   title: string;
   subtitle: string;
   body: string;
};

function DashboardCard({ title, subtitle, body }: DashboardCardProps) {
   return (
      <Card>
         <CardHeader>
            <CardTitle>{title}</CardTitle>
            <CardDescription>{subtitle}</CardDescription>
         </CardHeader>
         <CardContent>
            <p>{body}</p>
         </CardContent>
      </Card>
   );
}
