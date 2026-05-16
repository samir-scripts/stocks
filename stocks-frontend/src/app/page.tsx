import React from "react";
import Dashboard from "@/components/Dashboard";
import { getCachedStockData } from "@/lib/data";

export const dynamic = 'force-dynamic';

export default async function Home() {
  const stockData = await getCachedStockData();

  return (
    <main className="min-h-screen">
      <Dashboard initialData={stockData} />
    </main>
  );
}
