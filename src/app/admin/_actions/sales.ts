"use server";
import { getCurrentUserFromSession } from "@/app/(auth)/_actions/auth";
import db from "@/db/db";

import { redirect } from "next/navigation";

interface SalesByMonth {
   month: string;
   amount: number;
   numberOfSales: number;
}

interface TopSellingProduct {
   productName: string;
   totalRevenue: number;
   numberOfSales: number;
}

interface SalesByCategory {
   category: string;
   totalRevenue: number;
}

interface SalesData {
   salesByMonth: SalesByMonth[];
   topSellingProducts: TopSellingProduct[];
   salesByCategory: SalesByCategory[];
}

async function getSalesByMonth(
   userId: string,
   isAdmin: boolean
): Promise<SalesByMonth[]> {
   const where = isAdmin ? {} : { userId };
   const salesByMonth = await db.order.groupBy({
      by: ["createdAt"],
      _sum: { pricePaidInCents: true },
      _count: true,
      where,
      orderBy: { createdAt: "asc" },
   });

   return salesByMonth.map((sale) => ({
      month: new Date(sale.createdAt).toLocaleString("default", { month: "long" }),
      amount: (sale._sum.pricePaidInCents || 0) / 100,
      numberOfSales: sale._count,
   }));
}

async function getTopSellingProducts(
   userId: string,
   isAdmin: boolean
): Promise<TopSellingProduct[]> {
   const where = isAdmin ? {} : { userId };
   const topProducts = await db.order.groupBy({
      by: ["productId"],
      _sum: { pricePaidInCents: true },
      _count: { productId: true },
      where,
      orderBy: { _sum: { pricePaidInCents: "desc" } },
      take: 5,
   });

   const products = await db.product.findMany({
      where: {
         id: {
            in: topProducts.map((product) => product.productId),
         },
      },
   });

   return topProducts.map((product) => ({
      productName:
         products.find((p) => p.id === product.productId)?.name || "Unnamed Product",
      totalRevenue: (product._sum.pricePaidInCents || 0) / 100,
      numberOfSales: product._count.productId,
   }));
}

async function getSalesByCategory(
   userId: string,
   isAdmin: boolean
): Promise<SalesByCategory[]> {
   const where = isAdmin ? {} : { userId };
   const sales = await db.order.findMany({
      where,
      select: {
         product: {
            select: {
               category: true,
            },
         },
         pricePaidInCents: true,
      },
   });

   const categoryMap = sales.reduce((acc, sale) => {
      const category = sale.product.category;
      acc.set(category, (acc.get(category) || 0) + sale.pricePaidInCents);
      return acc;
   }, new Map<string, number>());

   return Array.from(categoryMap.entries()).map(([category, totalRevenue]) => ({
      category,
      totalRevenue: totalRevenue / 100,
   }));
}

export async function fetchAllSalesData(): Promise<SalesData> {
   const user = await getCurrentUserFromSession();
   if (!user?.userId) {
      redirect("/sign-in");
   }

   const isAdmin = user.role === "admin";
   const [salesByMonth, topSellingProducts, salesByCategory] = await Promise.all([
      getSalesByMonth(user.userId as string, isAdmin),
      getTopSellingProducts(user.userId as string, isAdmin),
      getSalesByCategory(user.userId as string, isAdmin),
   ]);

   return { salesByMonth, topSellingProducts, salesByCategory };
}
