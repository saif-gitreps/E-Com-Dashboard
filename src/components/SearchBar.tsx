import { Input } from "./ui/input";
import { Search } from "lucide-react";

export default function SearchBar() {
   return (
      <div className="relative w-44 sm:max-w-60">
         <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:cursor-pointer hover:opacity-80" />
         <Input
            placeholder="Search..."
            className="rounded-none w-full border-2 pr-12 pl-4 sm:py-7 py-3 text-white bg-black border-black overflow-hidden focus-visible:ring-0 focus-visible:ring-offset-0 text-base"
         />
      </div>
   );
}
