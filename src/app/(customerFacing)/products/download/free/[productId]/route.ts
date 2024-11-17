import db from "@/db/db";
import { getProductDownloadData } from "@/lib/supbase-storage-api";
import fs from "fs/promises";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
   req: NextRequest,
   { params: { productId } }: { params: { productId: string } }
) {
   const product = await db.product.findUnique({
      where: { id: productId },
      select: { filePath: true, name: true },
   });

   if (product == null)
      return NextResponse.redirect(new URL("/products/download/expired", req.url));

   // TODO: create an order or something to track number of downloads

   const { size, file, extension } = await getProductDownloadData(product.filePath);

   return new NextResponse(file, {
      headers: {
         "Content-Disposition": `attachment; filename="${product.name}.${extension}"`,
         "Content-Length": size.toString(),
      },
   });
}
