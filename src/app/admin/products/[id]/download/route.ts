import db from "@/db/db";
import { notFound } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import { getProductDownloadData } from "@/lib/supbase-storage-api";

export async function GET(
   req: NextRequest,
   { params: { id } }: { params: { id: string } }
) {
   const product = await db.product.findUnique({
      where: { id },
      select: {
         filePath: true,
         name: true,
      },
   });

   if (product === null) return notFound();

   const { size, file, extension } = await getProductDownloadData(product.filePath);

   return new NextResponse(file, {
      headers: {
         "Content-Disposition": `attachment; filename="${product.name}.${extension}"`,
         "Content-Length": size.toString(),
      },
   });
}
