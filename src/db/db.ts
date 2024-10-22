import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as { prisma?: PrismaClient };

const prismaClientSingleton = () => {
   return new PrismaClient({
      datasources: {
         db: {
            url: process.env.DATABASE_URL,
         },
      },
      log: ["error", "warn"],
   });
};

const db = globalForPrisma.prisma ?? prismaClientSingleton();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;

export default db;
