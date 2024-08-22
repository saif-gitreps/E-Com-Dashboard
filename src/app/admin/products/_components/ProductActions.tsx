"use client";

import { useTransition } from "react";
import { deleteProduct, toggleProductAvailability } from "../../_actions/product";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";

export function ActiveToggleDropdownItem({
   id,
   isAvailableForPurchase,
}: {
   id: string;
   isAvailableForPurchase: boolean;
}) {
   const [isPending, startTransaction] = useTransition();
   const router = useRouter();
   return (
      <DropdownMenuItem
         onClick={() => {
            startTransaction(async () => {
               await toggleProductAvailability(id, !isAvailableForPurchase);
               router.refresh();
            });
         }}
         disabled={isPending}
      >
         {isAvailableForPurchase ? "Deactivate" : "Activate"}
      </DropdownMenuItem>
   );
}

// if we have orders, then disable is true, so as to prevent deletion of products that have orders.
export function DeleteDropdownItem({ id, disabled }: { id: string; disabled: boolean }) {
   const [isPending, startTransaction] = useTransition();
   const router = useRouter();
   return (
      <DropdownMenuItem
         variant="destructive"
         onClick={() => {
            startTransaction(async () => {
               await deleteProduct(id);
               router.refresh();
            });
         }}
         disabled={disabled || isPending}
      >
         Delete
      </DropdownMenuItem>
   );
}
