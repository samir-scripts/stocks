import React from "react";
import { getCachedStockData } from "@/lib/data";
import { DashboardProvider } from "@/components/DashboardProvider";
import { TickerDropdown } from "@/components/TickerDropdown";
import { TickerSummary } from "@/components/TickerSummary";
import { DashboardChartSection } from "@/components/DashboardChartSection";
import { ThemeToggle } from "@/components/ThemeToggle";

export const dynamic = "force-dynamic";

export default async function Home() {
  const stockData = await getCachedStockData();

  return (
    <main className="min-h-screen">
      <DashboardProvider initialData={stockData}>
        <div className="max-w-6xl mx-auto space-y-8 p-4 md:p-8">
          {/* Header */}
          <header className="border-b border-charcoal-black pb-4 flex justify-between items-start">
            <div>
              <h1 className="text-4xl font-bold tracking-tighter text-foreground uppercase">
                tech.stalks
              </h1>
              <p className="text-foreground/60 italic">v1.0</p>
            </div>
            <ThemeToggle />
          </header>

          {/* Controls */}
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <TickerDropdown />
            <TickerSummary />
          </div>

          {/* Chart Section */}
          <DashboardChartSection />

          {/* Footer Info */}
          <footer className="pt-8 grid grid-cols-1 md:grid-cols-3 gap-8 border-t border-foreground/10">
            <div className="space-y-2">
              <p className="text-xs text-foreground/40 uppercase tracking-widest">
                Data updated nightly at midnight
              </p>
            </div>
          </footer>
        </div>
      </DashboardProvider>
    </main>
  );
}
