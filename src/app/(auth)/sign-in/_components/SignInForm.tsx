"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useFormState, useFormStatus } from "react-dom";
import SpinLoader from "@/components/SpinLoader";
import { AuthState, signIn } from "../../_actions/auth";

export function SignInForm() {
   const [state, action] = useFormState<AuthState, FormData>(signIn, {});

   return (
      <form className="space-y-4 max-w-xl mx-auto" action={action}>
         <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input type="email" id="email" name="email" required />
            {state.fieldErrors?.email && (
               <div className="text-destructive">{state.fieldErrors?.email}</div>
            )}
         </div>

         <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input type="password" id="password" name="password" required />
            {state.fieldErrors?.password && (
               <div className="text-destructive">{state.fieldErrors?.password}</div>
            )}
         </div>

         {state.error && <div className="text-destructive">{state.error}</div>}

         <SubmitButton />
      </form>
   );
}

function SubmitButton() {
   const { pending } = useFormStatus();
   return (
      <Button type="submit" disabled={pending} className="w-full">
         {pending ? <SpinLoader>Please wait..</SpinLoader> : "Sign in"}
      </Button>
   );
}
