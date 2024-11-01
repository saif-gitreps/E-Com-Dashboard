"use client";

import { UpdateState, updateUserDetails } from "@/app/(auth)/_actions/auth";
import SubmitButton from "@/components/SubmitButton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User } from "@prisma/client";
import { useFormState } from "react-dom";

export default function ProfileForm({ user }: { user: User }) {
   const [state, action] = useFormState<UpdateState, FormData>(updateUserDetails, {
      success: false,
   });

   return (
      <form className="space-y-4 max-w-xl mx-auto" action={action}>
         <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input type="email" id="email" name="email" required value={user.email} />
            <Input type="hidden" name="oldEmail" value={user.email} required />
            {state.fieldErrors?.email && (
               <div className="text-destructive">{state.fieldErrors?.email}</div>
            )}
         </div>

         <div className="space-y-2">
            <Label htmlFor="password">Old password</Label>
            <Input type="password" id="password" name="password" />
            {state.fieldErrors?.password && (
               <div className="text-destructive">{state.fieldErrors?.password}</div>
            )}
         </div>

         <div className="space-y-2">
            <Label htmlFor="new-password">New password</Label>
            <Input type="password" id="new-password" name="newPassword" />
         </div>

         {state.success && (
            <div className="text-green-600">Profile updated successfully!</div>
         )}

         {state.error && <div className="text-destructive">{state.error}</div>}

         <SubmitButton beforeLoading="Save" whileLoading="Please wait.." key="auth" />
      </form>
   );
}
