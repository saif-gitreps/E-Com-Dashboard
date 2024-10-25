"use server";

import { z } from "zod";

import { redirect } from "next/navigation";
import { createSession, deleteSession } from "@/lib/session";
import bcrypt from "bcrypt";
import db from "@/db/db";

const authSchema = z.object({
   email: z.string().email({ message: "Invalid email address" }).trim(),
   password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters" })
      .trim(),
});

export type TAuthFormData = z.infer<typeof authSchema>;

export type AuthState = {
   fieldErrors?: {
      email?: string[];
      password?: string[];
   };
   error?: string;
};

export async function signIn(
   prevState: AuthState,
   formData: FormData
): Promise<AuthState> {
   const result = authSchema.safeParse(Object.fromEntries(formData));

   if (!result.success) {
      return {
         fieldErrors: result.error.formErrors.fieldErrors,
      };
   }

   const { email, password } = result.data;

   const userFromDb = await db.user.findFirst({
      where: { email },
   });

   if (!userFromDb || !(await bcrypt.compare(password, userFromDb.password))) {
      return {
         error: "Invalid credentials",
      };
   }

   await createSession(userFromDb.id, userFromDb.role);
   redirect("/");
}

export async function signUp(prevState: AuthState, formData: FormData) {
   const result = authSchema.safeParse(Object.fromEntries(formData));

   if (!result.success) {
      return {
         errors: result.error.flatten().fieldErrors,
      };
   }

   const { email, password } = result.data;

   const userFromDb = await db.user.findFirst({
      where: {
         email,
      },
   });

   if (userFromDb) {
      return {
         error: "Account with the same email already exists. Try signing in",
      };
   }

   const newUser = await db.user.create({
      data: {
         email,
         password: await bcrypt.hash(password, 10),
      },
   });

   if (!newUser) {
      return {
         error: "Failed to create user. Please try again",
      };
   }

   await createSession(newUser.id, newUser.role);

   // TODO: Redirect to the origin at which the user was prompted to sign in
   redirect("/");
}

export async function logout() {
   await deleteSession();
   // redirect("/sign-in");
}
