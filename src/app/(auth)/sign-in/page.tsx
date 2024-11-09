"use client";

import { Suspense } from "react";
import { PageHeader } from "@/components/PageHeader";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { SignInForm } from "../_components/SignInForm";

function SignInContent() {
   const searchParams = useSearchParams();
   const isSeller = searchParams.get("as") === "seller";

   const router = useRouter();

   return (
      <div className="mt-20 p-2 space-y-5">
         <PageHeader className="text-center">Sign in</PageHeader>
         <p className="text-center">
            New to the platform?{" "}
            <Link href="/sign-up" className="text-blue-700 hover:underline">
               Create a new account
            </Link>
         </p>

         <SignInForm />

         <p className="text-center">
            {isSeller ? (
               <Button
                  className="text-base"
                  variant="outline"
                  onClick={() => {
                     router.replace("/sign-in", undefined);
                  }}
               >
                  Continue as customer
               </Button>
            ) : (
               <Button
                  className="text-base"
                  variant="outline"
                  onClick={() => {
                     router.push("?as=seller");
                  }}
               >
                  Continue as seller
               </Button>
            )}
         </p>

         <p className="text-center">Or</p>

         <p className="text-center">
            <Link href="/" className="text-blue-700 hover:underline">
               Continue browsing products
            </Link>
         </p>
      </div>
   );
}

export default function SignIn() {
   return (
      <Suspense fallback={<div className="text-center">Loading...</div>}>
         <SignInContent />
      </Suspense>
   );
}
