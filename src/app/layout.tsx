import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import Head from "next/head";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
   title: "Assets Haven",
   description: "Platform to trade digital assets and softwares",
};

export default function RootLayout({
   children,
}: Readonly<{
   children: React.ReactNode;
}>) {
   return (
      <html lang="en">
         <Head>
            <link rel="Logo" href="/public/logo/assets-haven.png" />
         </Head>
         <body
            className={cn(
               "min-h-screen bg-background font-sans antialiased",
               inter.variable
            )}
         >
            {children}
         </body>
      </html>
   );
}
