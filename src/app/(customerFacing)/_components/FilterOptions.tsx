"use client";

import { Label } from "@/components/ui/label";
import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from "@/components/ui/select";
import { useRouter, useSearchParams } from "next/navigation";

export default function FilterOptions() {
   const router = useRouter();

   const searchParams = useSearchParams();

   const categories = [
      "All",
      "icons",
      "themes",
      "fonts",
      "logos",
      "photos",
      "web-templates",
      "digtal-arts",
      "books",
      "study-materials",
      "pdf",
      "games",
      "softwares",
   ];

   const updateFilter = (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());

      if (value === "All") {
         params.delete(name);
      } else {
         params.set(name, value);
      }

      params.delete("page");

      router.push(`?${params.toString()}`);
   };

   return (
      <div className="flex flex-col sm:flex-row space-x-2">
         <div className="grid grid-cols-2 sm:flex sm:justify-evenly sm:items-center gap-4 border p-4 rounded">
            <div className="flex flex-col space-y-2">
               <Label>Category:</Label>
               <Select
                  value={searchParams.get("category") || "All"}
                  onValueChange={(value) => updateFilter("category", value)}
               >
                  <SelectTrigger className="w-full">
                     <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                     {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                           {category}
                        </SelectItem>
                     ))}
                  </SelectContent>
               </Select>
            </div>

            <div className="flex flex-col space-y-2">
               <Label>Price:</Label>
               <Select
                  value={searchParams.get("orderByPrice") || "asc"}
                  onValueChange={(value) => updateFilter("orderByPrice", value)}
               >
                  <SelectTrigger className="w-full">
                     <SelectValue placeholder="Order by price" defaultValue="asc" />
                  </SelectTrigger>
                  <SelectContent>
                     <SelectItem value="asc">Lowest</SelectItem>
                     <SelectItem value="desc">Highest</SelectItem>
                  </SelectContent>
               </Select>
            </div>

            <div className="flex flex-col space-y-2">
               <Label>Rating:</Label>
               <Select
                  value={searchParams.get("orderByRating") || "desc"}
                  onValueChange={(value) => updateFilter("orderByRating", value)}
               >
                  <SelectTrigger className="w-full">
                     <SelectValue placeholder="Order by rating" defaultValue="desc" />
                  </SelectTrigger>
                  <SelectContent>
                     <SelectItem value="asc">Lowest</SelectItem>
                     <SelectItem value="desc">Highest</SelectItem>
                  </SelectContent>
               </Select>
            </div>

            <div className="flex flex-col space-y-2">
               <Label>Date:</Label>
               <Select
                  value={searchParams.get("orderByDate") || "desc"}
                  onValueChange={(value) => updateFilter("orderByDate", value)}
               >
                  <SelectTrigger className="w-full">
                     <SelectValue placeholder="Order by date" defaultValue="desc" />
                  </SelectTrigger>
                  <SelectContent>
                     <SelectItem value="asc">Latest</SelectItem>
                     <SelectItem value="desc">Oldest</SelectItem>
                  </SelectContent>
               </Select>
            </div>

            <div className="flex flex-col space-y-2">
               <Label>Sales:</Label>
               <Select
                  value={searchParams.get("orderBySales") || "desc"}
                  onValueChange={(value) => updateFilter("orderBySales", value)}
               >
                  <SelectTrigger className="w-full">
                     <SelectValue placeholder="Order by prod. sold" defaultValue="desc" />
                  </SelectTrigger>
                  <SelectContent>
                     <SelectItem value="desc">Most sold</SelectItem>
                     <SelectItem value="asc">Least sold</SelectItem>
                  </SelectContent>
               </Select>
            </div>
         </div>
      </div>
   );
}
