"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { createSession, decrypt, deleteSession } from "@/lib/session";
import bcrypt from "bcrypt";
import db from "@/db/db";
import { cookies } from "next/headers";
import { JWTPayload } from "jose";

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
      email?: string[] | string;
      password?: string[] | string;
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

const updateSchema = z.object({
   email: z.string().email({ message: "Invalid email address" }).trim().optional(),
   oldEmail: z.string().email({ message: "Invalid email address" }).trim(),
   password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters" })
      .trim()
      .optional(),
   newPassword: z
      .string()
      .min(8, { message: "Password must be at least 8 characters" })
      .trim()
      .optional(),
});

export type UpdateState = {
   fieldErrors?: {
      email?: string[];
      password?: string[];
      newPassword?: string[];
      oldEmail?: string[];
   };
   error?: string;
   success?: boolean;
};

export async function updateUserDetails(
   prevState: UpdateState,
   formData: FormData
): Promise<UpdateState> {
   const result = updateSchema.safeParse(Object.fromEntries(formData));

   if (!result.success) {
      return {
         fieldErrors: result.error.flatten().fieldErrors,
      };
   }

   const { email, password, newPassword } = result.data;
   const user = await db.user.findFirst({
      where: {
         email: result.data.oldEmail,
      },
   });

   if (!user) {
      redirect("/sign-in");
   }

   try {
      if (email !== user.email) {
         const userWithNewEmail = await db.user.findFirst({
            where: {
               email,
            },
         });

         if (userWithNewEmail) {
            return {
               error: "Account with the same email already exists",
            };
         } else {
            await db.user.update({
               where: {
                  id: user.id,
               },
               data: {
                  email,
               },
            });
         }
      }

      if (newPassword && !password) {
         return {
            error: "Please enter old password",
         };
      }

      if (password && newPassword) {
         if (!(await bcrypt.compare(password, user.password))) {
            return {
               error: "Invalid old password",
            };
         }
         await db.user.update({
            where: {
               id: user.id,
            },
            data: {
               password: await bcrypt.hash(newPassword, 10),
            },
         });
      }

      return {
         success: true,
      };
   } catch (error) {
      return {
         error: "An error occurred while updating user details",
      };
   }
}

export async function getCurrentUserFromSession(): Promise<JWTPayload | null> {
   const cookie = cookies().get("session")?.value;
   const session = await decrypt(cookie);

   if (!session?.userId) {
      return null;
   } else {
      return session;
   }
}
