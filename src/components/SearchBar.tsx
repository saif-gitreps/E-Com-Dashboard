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

   const searchDebounce = debounce(() => {
      const params = new URLSearchParams(searchParams.toString());

      if (searchQuery === "") {
         params.delete("searchQuery");
      } else {
         params.set("searchQuery", searchQuery.toLowerCase());
      }

      params.delete("category");
      params.delete("page");
      params.delete("orderByPrice");
      params.delete("orderByRating");
      params.delete("orderByDate");

      router.push(`/products?${params.toString()}`);
   }, 300);

   const debouncedSearchAction = useCallback(searchDebounce, [
      searchQuery,
      searchParams,
      searchDebounce,
   ]);

   const handleSearchQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchQuery(e.target.value);
      //debouncedSearchAction();
   };

   return (
      <div className="relative w-60 sm:max-w-72">
         <Search
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-black hover:cursor-pointer hover:opacity-50"
            onClick={debouncedSearchAction}
         />
         <Input
            onChange={handleSearchQueryChange}
            value={searchQuery}
            placeholder="Search..."
            className="rounded w-full border-2 pr-12 pl-4 py-2 text-black bg-white overflow-hidden text-base"
         />
      </div>
   );
}
