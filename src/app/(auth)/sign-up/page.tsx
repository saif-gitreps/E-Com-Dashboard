import { PageHeader } from "@/components/PageHeader";
import { SignUpForm } from "./_components/SignUpForm";
import Link from "next/link";

export default function SignUp() {
   return (
      <div className="mt-20 border p-2">
         <PageHeader className="text-center">Sign up</PageHeader>
         <p className="text-center">
            Have an account already?{" "}
            <Link href="/sign-in" className="text-blue-700 hover:underline">
               Login
            </Link>
         </p>
         <SignUpForm />

         <p className="text-center mt-10">
            Or{" "}
            <Link href="/" className="text-blue-700 hover:underline">
               continue browsing
            </Link>
         </p>
      </div>
   );
}
