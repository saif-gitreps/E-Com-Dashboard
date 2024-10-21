"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useFormState, useFormStatus } from "react-dom";
import Image from "next/image";
import SpinLoader from "@/components/SpinLoader";

export function SignUpForm() {
   //const [error, action] = useFormState(null, {});

   return (
      <form
         className="space-y-8 max-w-xl mx-auto"
         //action={action}
      >
         <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input type="email" id="email" name="email" required />
            {/* {error.email && <div className="text-destructive">{error.email}</div>} */}
         </div>
         <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input type="password" id="password" name="password" required />
            {/* {error.email && <div className="text-destructive">{error.email}</div>} */}
         </div>
         <SubmitButton />
      </form>
   );
}

function SubmitButton() {
   const { pending } = useFormStatus();
   return (
      <Button type="submit" disabled={pending}>
         {pending ? <SpinLoader>Please wait..</SpinLoader> : "Sign up"}
      </Button>
   );
}
