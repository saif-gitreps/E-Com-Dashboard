import { PageHeader } from "@/components/PageHeader";
import { SignInForm } from "./_components/SignInForm";
import Link from "next/link";

export default function SignIn() {
   return (
      <div className="mt-20 border p-2">
         <PageHeader className="text-center">Sign in</PageHeader>
         <p className="text-center">
            New to the platform?{" "}
            <Link href="/sign-up" className="text-blue-700 hover:underline">
               Create a new account
            </Link>
         </p>
         <SignInForm />

         <p className="text-center mt-10">
            Or{" "}
            <Link href="/" className="text-blue-700 hover:underline">
               continue browsing
            </Link>
         </p>
      </div>
   );
}
