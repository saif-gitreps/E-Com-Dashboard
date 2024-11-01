import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import SubmitButton from "../../../components/SubmitButton";

export default function UserForm({ state, action }: { state: any; action: any }) {
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

         <SubmitButton beforeLoading="Submit" whileLoading="Please wait.." key="auth" />
      </form>
   );
}
