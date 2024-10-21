import { Loader2 } from "lucide-react";

export default function SpinLoader({ children }: { children?: React.ReactNode }) {
   return (
      <>
         <Loader2 className="animate-spin" />
         <p className="ml-1">{children}</p>
      </>
   );
}
