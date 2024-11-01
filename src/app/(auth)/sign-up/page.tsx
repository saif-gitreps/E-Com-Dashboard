import { PageHeader } from "@/components/PageHeader";
import { SignUpForm } from "../_components/SignUpForm";
import Link from "next/link";

export default function SignUp() {
   return (
      <div className="mt-20 p-2 space-y-5">
         <PageHeader className="text-center">Sign up</PageHeader>
         <p className="text-center">
            Have an account already?{" "}
            <Link href="/sign-in" className="text-blue-700 hover:underline">
               Login
            </Link>
         </p>
         <SignUpForm />

         <p className="text-center">
            Or{" "}
            <Link href="/" className="text-blue-700 hover:underline">
               continue browsing
            </Link>
         </p>

         <div>
            <h2 className="text-center font-bold text-gray-700">
               Join our platform to get all sorts of digital products including freebies!
            </h2>
            <h3 className="text-center font-bold text-gray-500">
               Additionaly you can become a seller or a contributor and share your
               products for others.
            </h3>
         </div>
      </div>
   );
}
