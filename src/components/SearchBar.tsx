"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "./ui/input";
import { Search } from "lucide-react";
import { useCallback, useState } from "react";
import { debounce } from "lodash";

export default function SearchBar() {
   const [searchQuery, setSearchQuery] = useState<string>("");

   const router = useRouter();

   const searchParams = useSearchParams();

   const debouncedSearchAction = useCallback(
      debounce(() => {
         const params = new URLSearchParams(searchParams.toString());

         if (searchQuery === "") {
            params.delete("searchQuery");
         } else {
            params.set("searchQuery", searchQuery.toLowerCase());
         }

         params.delete("page");

         router.push(`/products?${params.toString()}`);
      }, 300),
      [searchQuery, searchParams, router]
   );

   const handleSearchQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchQuery(e.target.value);
      //debouncedSearchAction();
   };

   return (
      <div className="relative w-44 sm:max-w-60">
         <Search
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:cursor-pointer hover:opacity-80"
            onClick={debouncedSearchAction}
         />
         <Input
            onChange={handleSearchQueryChange}
            value={searchQuery}
            placeholder="Search..."
            className="rounded-none w-full border-2 pr-12 pl-4 sm:py-7 py-3 text-white bg-black border-black overflow-hidden focus-visible:ring-0 focus-visible:ring-offset-0 text-base"
         />
      </div>
   );
}
