"use client";

import React, { useState } from "react";
import { StockDataMap } from "@/lib/data";
import { TickerDropdown } from "@/components/TickerDropdown";
import { TickerSummary } from "@/components/TickerSummary";
import { DashboardChartSection } from "@/components/DashboardChartSection";
import { ThemeToggle } from "@/components/ThemeToggle";

interface DashboardProps {
  initialData: StockDataMap;
}

export default function Dashboard({ initialData }: DashboardProps) {
  const tickers = Object.keys(initialData);
  const [selectedTicker, setSelectedTicker] = useState<string>(
    tickers[0] || "",
  );

  const data = selectedTicker ? initialData[selectedTicker] : [];
  const lastRecord = data.length > 0 ? data[data.length - 1] : null;

  return (
    <div className="max-w-6xl mx-auto space-y-8 p-4 md:p-8">
      {/* Header */}
      <header className="border-b border-primary-blue pb-4 flex justify-between items-start">
        <div>
          <h1 className="text-4xl font-bold tracking-tighter text-foreground uppercase">
            .tech_stocks
          </h1>
          <p className="text-foreground/60 italic">
            v1.0 (Static Server-Rendered)
          </p>
        </div>
        <ThemeToggle />
      </header>

      {/* Controls */}
      <div className="flex flex-col md:flex-row md:items-center gap-4">
        <TickerDropdown
          tickers={tickers}
          selectedTicker={selectedTicker}
          onTickerChange={setSelectedTicker}
        />
        <TickerSummary lastRecord={lastRecord} />
      </div>

      {/* Chart Section */}
      <DashboardChartSection data={data} />

      {/* Footer Info */}
      <footer className="pt-8 grid grid-cols-1 md:grid-cols-3 gap-8 border-t border-foreground/10">
        <div className="space-y-2">
          <p className="text-xs text-foreground/40 uppercase tracking-widest">
            Data updated nightly at midnight
          </p>
        </div>
      </footer>
    </div>
  );
}
