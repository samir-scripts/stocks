"use client";

import React, { useState } from "react";
import { StockChart } from "@/components/StockChart";
import { StockDataMap } from "@/lib/data";

interface DashboardProps {
  initialData: StockDataMap;
}

export default function Dashboard({ initialData }: DashboardProps) {
  const tickers = Object.keys(initialData);
  const [selectedTicker, setSelectedTicker] = useState<string>(tickers[0] || "");

  const data = selectedTicker ? initialData[selectedTicker] : [];

  const chartData = data.map((item) => ({
    time: item.time,
    value: item.value,
  }));
  const movingAvgData = data.map((item) => ({
    time: item.time,
    value: item.moving_avg,
  }));

  const lastRecord = data.length > 0 ? data[data.length - 1] : null;

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <header className="border-b border-primary-blue pb-4">
        <h1 className="text-4xl font-bold tracking-tighter text-academic-gray uppercase">
          .tech_stocks
        </h1>
        <p className="text-academic-gray/60 italic">v1.0 (Static Server-Rendered)</p>
      </header>

      {/* Controls */}
      <div className="flex flex-col md:flex-row md:items-center gap-4">
        <div className="flex flex-col">
          <label
            htmlFor="ticker-select"
            className="text-sm font-bold uppercase tracking-widest text-academic-gray mb-1"
          >
            Select Ticker
          </label>
          <select
            id="ticker-select"
            value={selectedTicker}
            onChange={(e) => setSelectedTicker(e.target.value)}
            className="bg-white border-2 border-primary-blue px-4 py-2 rounded-sm text-academic-gray font-mono focus:ring-2 focus:ring-blueprint-blue outline-none cursor-pointer"
          >
            {tickers.map((ticker) => (
              <option key={ticker} value={ticker}>
                {ticker}
              </option>
            ))}
          </select>
        </div>

        {selectedTicker && lastRecord && (
          <div className="md:ml-auto grid grid-cols-2 gap-8 border-l-2 border-primary-blue pl-8">
            <div>
              <p className="text-xs uppercase font-bold text-academic-gray/60">
                Current Price
              </p>
              <p className="text-2xl font-bold text-academic-gray">
                $
                {lastRecord.value.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </p>
            </div>
            <div>
              <p className="text-xs uppercase font-bold text-academic-gray/60">
                Daily Return
              </p>
              <p
                className={`text-2xl font-bold ${lastRecord.daily_return >= 0 ? "text-green-600" : "text-red-600"}`}
              >
                {(lastRecord.daily_return * 100).toFixed(2)}%
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Chart Section */}
      <div className="relative min-h-[400px]">
        {data.length > 0 ? (
          <StockChart data={chartData} movingAvgData={movingAvgData} />
        ) : (
          <div className="h-[400px] flex items-center justify-center border-2 border-dashed border-academic-gray/20 rounded-lg">
            <p className="text-academic-gray/40">
              No data available for this ticker.
            </p>
          </div>
        )}
      </div>

      {/* Footer Info */}
      <footer className="pt-8 grid grid-cols-1 md:grid-cols-3 gap-8 border-t border-academic-gray/10">
        <div className="space-y-2">
            <p className="text-xs text-academic-gray/40 uppercase tracking-widest">
                Data updated nightly at midnight
            </p>
        </div>
      </footer>
    </div>
  );
}
