import { PageHeader } from "@/components/PageHeader";
import { fetchDashboardData } from "./_actions/dashboard";
import DashboardGrid from "./_components/DashboardGrid";
import SalesCharts from "./_components/SalesCharts";
import { fetchAllSalesData } from "./_actions/sales";
import { Suspense } from "react";

export default async function AdminDashboard() {
   const [{ salesData, userData, productData, isAdmin }, salesStats] = await Promise.all([
      fetchDashboardData(),
      fetchAllSalesData(),
   ]);

   return (
      <div className="space-y-8 p-6">
         <PageHeader>Overall Dashboard</PageHeader>

         <Suspense fallback={<div>Loading sales charts...</div>}>
            <SalesCharts
               salesByMonth={salesStats.salesByMonth}
               topSellingProducts={salesStats.topSellingProducts}
               salesByCategory={salesStats.salesByCategory}
            />
         </Suspense>

         <Suspense fallback={<div>Loading dashboard metrics...</div>}>
            <DashboardGrid
               salesData={salesData}
               userData={userData}
               productData={productData}
               isAdmin={isAdmin}
            />
         </Suspense>
      </div>
   );
}
