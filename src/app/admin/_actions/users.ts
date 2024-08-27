"use server";

import db from "@/db/db";
import { User } from "@prisma/client";
import { notFound } from "next/navigation";

export async function deleteUser(id: string): Promise<User> {
   const user = await db.user.delete({
      where: { id },
   });

   if (user == null) return notFound();

   return user;
}
