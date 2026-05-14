"use client";

import React, { useState, useEffect } from "react";
import { StockChart } from "@/components/StockChart";

interface PerformanceRecord {
  time: string;
  value: number;
  moving_avg: number;
  daily_return: number;
}

export default function Home() {
  const [tickers, setTickers] = useState<string[]>([]);
  const [selectedTicker, setSelectedTicker] = useState<string>("");
  const [data, setData] = useState<PerformanceRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/tickers")
      .then((res) => res.json())
      .then((tickers) => {
        setTickers(tickers);
        if (tickers.length > 0) {
          setSelectedTicker(tickers[0]);
        }
      })
      .catch((err) => console.error("Failed to load tickers", err));
  }, []);

  useEffect(() => {
    if (!selectedTicker) return;

    setLoading(true);
    fetch(`/api/performance?ticker=${selectedTicker}`)
      .then((res) => res.json())
      .then((data) => {
        setData(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load performance data", err);
        setLoading(false);
      });
  }, [selectedTicker]);

  const chartData = data.map((item) => ({
    time: item.time,
    value: item.value,
  }));
  const movingAvgData = data.map((item) => ({
    time: item.time,
    value: item.moving_avg,
  }));

  return (
    <main className="min-h-screen p-8 md:p-24 bg-paper-white">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <header className="border-b border-primary-blue pb-4">
          <h1 className="text-4xl font-bold tracking-tighter text-academic-gray uppercase">
            .tech_stocks
          </h1>
          <p className="text-academic-gray/60 italic">v1.0</p>
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

          {selectedTicker && !loading && data.length > 0 && (
            <div className="md:ml-auto grid grid-cols-2 gap-8 border-l-2 border-primary-blue pl-8">
              <div>
                <p className="text-xs uppercase font-bold text-academic-gray/60">
                  Current Price
                </p>
                <p className="text-2xl font-bold text-academic-gray">
                  $
                  {data[data.length - 1].value.toLocaleString(undefined, {
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
                  className={`text-2xl font-bold ${data[data.length - 1].daily_return >= 0 ? "text-green-600" : "text-red-600"}`}
                >
                  {(data[data.length - 1].daily_return * 100).toFixed(2)}%
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Chart Section */}
        <div className="relative min-h-[400px]">
          {loading ? (
            <div className="absolute inset-0 flex items-center justify-center bg-white/50 z-10">
              <p className="text-lg font-bold animate-pulse text-primary-blue uppercase tracking-widest">
                Analyzing Data...
              </p>
            </div>
          ) : data.length > 0 ? (
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
            <h3 className="text-xs font-bold uppercase text-primary-blue">
              Documentation
            </h3>
            <p className="text-sm text-academic-gray/70 leading-relaxed">
              Charts display daily closing prices with a superimposed 7-day
              simple moving average (dashed). Calculations derived from the
              `stock_performance` mart.
            </p>
          </div>
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase text-primary-blue">
              Data Source
            </h3>
            <p className="text-sm text-academic-gray/70 leading-relaxed">
              PostgreSQL / dbt-Core Pipeline. Refreshed nightly via CRON.
            </p>
          </div>
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase text-primary-blue">
              Technical Specs
            </h3>
            <p className="text-sm text-academic-gray/70">
              Next.js 15 / Tailwind v4 / Lightweight Charts
            </p>
          </div>
        </footer>
      </div>
    </main>
  );
}
