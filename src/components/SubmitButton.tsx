"use client";

import { useFormStatus } from "react-dom";
import SpinLoader from "./SpinLoader";
import { Button } from "./ui/button";

export default function SubmitButton({
   beforeLoading,
   whileLoading,
}: {
   beforeLoading?: string;
   whileLoading?: string;
}) {
   const { pending } = useFormStatus();
   return (
      <Button type="submit" disabled={pending} className="w-full">
         {pending ? <SpinLoader>{whileLoading}</SpinLoader> : beforeLoading}
      </Button>
   );
}
