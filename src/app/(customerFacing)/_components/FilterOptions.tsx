"use client";

import { Label } from "@/components/ui/label";
import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from "@/components/ui/select";

export default function FilterOptions() {
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

   return (
      <div className="flex flex-col sm:flex-row space-x-2">
         <div className="grid grid-cols-2 sm:flex sm:justify-evenly sm:items-center gap-4 border p-4 rounded">
            <div className="flex flex-col space-y-2">
               <Label>Catergory:</Label>
               <Select defaultValue="All" name="category">
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

            <div className="flex flex-col  space-y-2">
               <Label>Price:</Label>
               <Select defaultValue="desc" name="orderByPrice">
                  <SelectTrigger className="w-full">
                     <SelectValue placeholder="Order by price" />
                  </SelectTrigger>
                  <SelectContent>
                     <SelectItem value="asc">Lowest</SelectItem>
                     <SelectItem value="desc">Highest</SelectItem>
                  </SelectContent>
               </Select>
            </div>

            <div className="flex flex-col space-y-2">
               <Label>Rating:</Label>
               <Select defaultValue="desc" name="orderByRating">
                  <SelectTrigger className="w-full">
                     <SelectValue placeholder="Order by rating" />
                  </SelectTrigger>
                  <SelectContent>
                     <SelectItem value="asc">Lowest</SelectItem>
                     <SelectItem value="desc">Highest</SelectItem>
                  </SelectContent>
               </Select>
            </div>

            <div className="flex flex-col space-y-2">
               <Label>Date:</Label>
               <Select defaultValue="desc" name="orderByDate">
                  <SelectTrigger className="w-full">
                     <SelectValue placeholder="Order by date" />
                  </SelectTrigger>
                  <SelectContent>
                     <SelectItem value="asc">Latest</SelectItem>
                     <SelectItem value="desc">Oldest</SelectItem>
                  </SelectContent>
               </Select>
            </div>

            <div className="flex flex-col space-y-2">
               <Label>Sales:</Label>
               <Select defaultValue="desc" name="orderBySales">
                  <SelectTrigger className="w-full">
                     <SelectValue placeholder="Order by prod. sold" />
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
