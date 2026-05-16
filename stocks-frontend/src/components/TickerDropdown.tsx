"use client";

import React from "react";
import { useDashboard } from "./DashboardProvider";

export const TickerDropdown: React.FC = () => {
  const { tickers, selectedTicker, setSelectedTicker } = useDashboard();

  return (
    <div className="flex flex-col">
      <label
        htmlFor="ticker-select"
        className="text-sm font-bold uppercase tracking-widest text-foreground/60 mb-1"
      >
        Select Ticker
      </label>
      <select
        id="ticker-select"
        value={selectedTicker}
        onChange={(e) => setSelectedTicker(e.target.value)}
        className="bg-background border-2 border-charcoal-black px-4 py-2 rounded-sm text-foreground font-mono focus:ring-2 focus:ring-blueprint-blue outline-none cursor-pointer"
      >
        {tickers.map((ticker) => (
          <option
            key={ticker}
            value={ticker}
            className="bg-background text-foreground"
          >
            {ticker}
          </option>
        ))}
      </select>
    </div>
  );
};
