"use server";

import { getCurrentUserFromSession } from "@/app/(auth)/_actions/auth";
import db from "@/db/db";

import { redirect } from "next/navigation";

async function getSalesData(userId: string, isAdmin: boolean) {
   const where: any = isAdmin ? {} : { userId };

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
   const where: any = isAdmin ? {} : { userId };

   const [userCount, orderData] = await Promise.all([
      db?.user.count({ where: { id: userId } }),
      db?.order.aggregate({ _sum: { pricePaidInCents: true }, where }),
   ]);

   return {
      userCount,
      averageValuePerUser:
         userCount === 0 ? 0 : (orderData._sum.pricePaidInCents || 0) / userCount / 100,
   };
}

async function getProductData(userId: string, isAdmin: boolean) {
   const where: any = isAdmin ? {} : { userId };

   const [activeCount, inactiveCount] = await Promise.all([
      db.product.count({ where: { ...where, isAvailableForPurchase: true } }),
      db.product.count({ where: { ...where, isAvailableForPurchase: false } }),
   ]);

   return { activeCount, inactiveCount };
}

export async function fetchDashboardData() {
   const user = await getCurrentUserFromSession();

   if (!user?.userId) {
      redirect("/sign-in");
   }

   const isAdmin = user.role === "admin";
   const [salesData, userData, productData] = await Promise.all([
      getSalesData(user.userId as string, isAdmin),
      getUserData(user.userId as string, isAdmin),
      getProductData(user.userId as string, isAdmin),
   ]);

   return { salesData, userData, productData, isAdmin };
}
