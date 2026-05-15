import React from "react";
import Dashboard from "@/components/Dashboard";
import { getCachedStockData } from "@/lib/data";

export const dynamic = 'force-dynamic';

export default async function Home() {
  const stockData = await getCachedStockData();

  return (
    <main className="min-h-screen p-8 md:p-24 bg-paper-white">
      <Dashboard initialData={stockData} />
    </main>
  );
}
