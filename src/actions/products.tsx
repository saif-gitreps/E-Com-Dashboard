"use server";

import db from "@/db/db";
import { cache } from "@/lib/cache";
import { Product as PrismaProductType } from "@prisma/client";

const ITEMS_PER_PAGE = 3;

type SearchParams = {
   category?: string;
   page?: string;
   orderByPrice?: string;
   orderByRating?: string;
   orderByDate?: string;
   orderBySales?: string;
   searchQuery?: string;
};

type Product = PrismaProductType & {
   averageRating: number;
   productReviews: {
      rating: number;
   }[];
   orders: {
      id: string;
   }[];
};

export const getProducts = cache(
   async (
      searchParams: SearchParams
   ): Promise<{ products: Product[]; total: number }> => {
      const page = Number(searchParams.page) || 1;
      const skip = (page - 1) * ITEMS_PER_PAGE;

      const where: any = {
         isAvailableForPurchase: true,
      };

      if (searchParams.category && searchParams.category !== "All") {
         where.category = searchParams.category;
      }

      if (searchParams.searchQuery !== undefined && searchParams.searchQuery !== "") {
         where.OR = [
            { name: { contains: searchParams.searchQuery, mode: "insensitive" } },
            {
               category: {
                  contains: searchParams.searchQuery,
                  mode: "insensitive",
               },
            },
         ];
      }

      let orderBy: any[] = [];

      if (searchParams.orderByPrice) {
         orderBy.push({ priceInCents: searchParams.orderByPrice });
      }

      if (searchParams.orderByDate) {
         orderBy.push({ createdAt: searchParams.orderByDate });
      }

      if (searchParams.orderBySales) {
         orderBy.push({
            orders: {
               _count: searchParams.orderBySales,
            },
         });
      }

      if (orderBy.length === 0) {
         orderBy.push({ name: "asc" });
      }

      const [queriedProducts, total] = await Promise.all([
         db.product.findMany({
            where,
            include: {
               productReviews: {
                  select: {
                     rating: true,
                  },
               },
               orders: {
                  select: {
                     id: true,
                  },
               },
            },
            orderBy,
            take: ITEMS_PER_PAGE,
            skip,
         }),
         db.product.count({ where }),
      ]);

      const products = queriedProducts
         .map((product) => ({
            ...product,
            averageRating:
               product.productReviews.reduce((acc, review) => acc + review.rating, 0) /
               (product.productReviews.length || 1),
         }))
         .sort((a, b) => {
            return searchParams?.orderByRating === "desc"
               ? b.averageRating - a.averageRating
               : a.averageRating - b.averageRating;
         });

      return { products, total };
   },
   ["/products", "getProducts"],
   {
      revalidate: 1,
   }
);
