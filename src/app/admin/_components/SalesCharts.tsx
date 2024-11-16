"use client";
import React from "react";
import {
   Chart as ChartJS,
   CategoryScale,
   LinearScale,
   PointElement,
   LineElement,
   Title,
   Tooltip,
   Legend,
   ChartOptions,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
   CategoryScale,
   LinearScale,
   PointElement,
   LineElement,
   Title,
   Tooltip,
   Legend
);

interface SalesByMonth {
   month: string;
   amount: number;
   numberOfSales: number;
}

interface TopSellingProduct {
   productName: string;
   totalRevenue: number;
   numberOfSales: number;
}

interface SalesByCategory {
   category: string;
   totalRevenue: number;
}

interface SalesChartProps {
   salesByMonth: SalesByMonth[];
   topSellingProducts: TopSellingProduct[];
   salesByCategory: SalesByCategory[];
}

const defaultOptions: ChartOptions<"line"> = {
   responsive: true,
   maintainAspectRatio: false,
   plugins: {
      legend: {
         position: "top" as const,
      },
      tooltip: {
         mode: "index",
         intersect: false,
         callbacks: {
            label: function (context) {
               return `$${context.parsed.y.toFixed(2)}`;
            },
         },
      },
   },
   scales: {
      y: {
         beginAtZero: true,
         ticks: {
            callback: (value) => `$${value}`,
         },
      },
   },
};

export default function SalesCharts({
   salesByMonth,
   topSellingProducts,
   salesByCategory,
}: SalesChartProps) {
   const chartHeight = "h-[400px]";

   const monthlyData = {
      labels: salesByMonth.map((sale) => sale.month),
      datasets: [
         {
            label: "Monthly Sales",
            data: salesByMonth.map((sale) => sale.amount),
            borderColor: "#3b82f6",
            backgroundColor: "rgba(59, 130, 246, 0.2)",
            fill: true,
            tension: 0.4,
         },
      ],
   };

   const categoryData = {
      labels: salesByCategory.map((sale) => sale.category),
      datasets: [
         {
            label: "Sales by Category",
            data: salesByCategory.map((sale) => sale.totalRevenue),
            borderColor: "#10b981",
            backgroundColor: "rgba(16, 185, 129, 0.2)",
            fill: true,
            tension: 0.4,
         },
      ],
   };

   const productsData = {
      labels: topSellingProducts.map((product) => product.productName),
      datasets: [
         {
            label: "Top Products Revenue",
            data: topSellingProducts.map((product) => product.totalRevenue),
            borderColor: "#ef4444",
            backgroundColor: "rgba(239, 68, 68, 0.2)",
            fill: true,
            tension: 0.4,
         },
      ],
   };

   return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
         <div className="bg-white rounded-xl shadow-md p-6 lg:col-span-10">
            <h2 className="text-xl font-semibold mb-4">Top Selling Products</h2>
            <div className={chartHeight}>
               <Line data={productsData} options={defaultOptions} />
            </div>
         </div>

         <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Monthly Sales Trend</h2>
            <div className={chartHeight}>
               <Line data={monthlyData} options={defaultOptions} />
            </div>
         </div>

         <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Sales by Category</h2>
            <div className={chartHeight}>
               <Line data={categoryData} options={defaultOptions} />
            </div>
         </div>
      </div>
   );
}
