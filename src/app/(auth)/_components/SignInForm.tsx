"use client";

import { useFormState } from "react-dom";
import { AuthState, signIn } from "../_actions/auth";
import UserForm from "./UserForm";
import { useSearchParams } from "next/navigation";

export function SignInForm() {
   const searchParams = useSearchParams();

   const isSeller: boolean = searchParams.get("as") === "seller";

   const encodedOrigin = searchParams.get("origin") || "/";

   const origin = decodeURIComponent(encodedOrigin);

   // simple closure to pass the isSeller & origin value to the signIn function
   const signInWithSeller = async (prevState: AuthState, formData: FormData) => {
      return signIn(prevState, formData, isSeller, origin);
   };

   const [state, action] = useFormState<AuthState, FormData>(signInWithSeller, {});

   return <UserForm state={state} action={action} />;
}
