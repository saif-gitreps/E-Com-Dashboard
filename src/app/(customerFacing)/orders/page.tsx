"use client";

import { Button } from "@/components/ui/button";
import {
   Card,
   CardContent,
   CardDescription,
   CardFooter,
   CardHeader,
   CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useFormStatus } from "react-dom";

export default function MyOrdersPage() {
   return (
      <form action="" className="max-w-2xl mx-auto">
         <Card>
            <CardHeader>
               <CardTitle>My Orders</CardTitle>
               <CardDescription>
                  Enter your email address to view your orders.
               </CardDescription>
            </CardHeader>
            <CardContent>
               <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input type="email" required name="email" id="email" />
               </div>
            </CardContent>
            <CardFooter>
               <SubmitButton />
            </CardFooter>
         </Card>
      </form>
   );
}

function SubmitButton() {
   const { pending } = useFormStatus();

   return (
      <Button className="w-full" size="lg" disabled={pending} type="submit">
         {pending ? "Sending.." : "Send"}
      </Button>
   );
}
