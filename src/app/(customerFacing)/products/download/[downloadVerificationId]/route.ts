import db from "@/db/db";
import { getProductDownloadData } from "@/lib/supbase-storage-api";
import fs from "fs/promises";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
   req: NextRequest,
   { params: { downloadVerificationId } }: { params: { downloadVerificationId: string } }
) {
   const data = await db.downloadVerification.findUnique({
      where: { id: downloadVerificationId, expiresAt: { gte: new Date() } },
      select: { product: { select: { filePath: true, name: true } } },
   });

   if (data == null)
      return NextResponse.redirect(new URL("/products/download/expired", req.url));

   const { size, file, extension } = await getProductDownloadData(data.product.filePath);

   return new NextResponse(file, {
      headers: {
         "Content-Disposition": `attachment; filename="${data.product.name}.${extension}"`,
         "Content-Length": size.toString(),
      },
   });
}
