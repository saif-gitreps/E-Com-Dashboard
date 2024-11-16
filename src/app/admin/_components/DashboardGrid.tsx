import { formatCurrency, formatNumber } from "@/lib/formatter";
import DashboardCard from "./DashboardCard";

type DashboardGridProps = {
   salesData: { amount: number; numberOfSales: number };
   userData: { userCount: number; averageValuePerUser: number };
   productData: { activeCount: number; inactiveCount: number };
   isAdmin: boolean;
};

export default function DashboardGrid({
   salesData,
   userData,
   productData,
   isAdmin,
}: DashboardGridProps) {
   return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
         <DashboardCard
            title={isAdmin ? "All Sales" : "My Sales"}
            subtitle={`${formatNumber(salesData.numberOfSales)} Orders`}
            body={formatCurrency(salesData.amount)}
         />
         <DashboardCard
            title={isAdmin ? "All Users" : "Customers"}
            subtitle={`${formatNumber(userData.averageValuePerUser)} Average sales`}
            body={formatNumber(userData.userCount)}
         />
         <DashboardCard
            title="Active Products"
            subtitle={`${formatNumber(productData.inactiveCount)} Inactive`}
            body={formatNumber(productData.activeCount)}
         />
      </div>
   );
}
