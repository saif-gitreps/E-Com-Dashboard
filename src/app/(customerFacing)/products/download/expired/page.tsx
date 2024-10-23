import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Expired() {
   return (
      <>
         <h1 className="text-4xl mb-4 font-semibold text-blue-950 mt-10">
            The download link has expired.
         </h1>
         <Button size="lg" asChild>
            <Link href="/orders">Get new link</Link>
         </Button>
      </>
   );
}
