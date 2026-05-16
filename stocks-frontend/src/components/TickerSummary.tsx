"use client";

import React from "react";
import { PerformanceRecord } from "@/lib/data";

interface TickerSummaryProps {
  lastRecord: PerformanceRecord | null;
}

export const TickerSummary: React.FC<TickerSummaryProps> = ({ lastRecord }) => {
  if (!lastRecord) return null;

  return (
    <div className="md:ml-auto grid grid-cols-2 gap-8 border-l-2 border-primary-blue pl-8">
      <div>
        <p className="text-xs uppercase font-bold text-foreground/60">
          Current Price
        </p>
        <p className="text-2xl font-bold text-foreground">
          $
          {lastRecord.value.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </p>
      </div>
      <div>
        <p className="text-xs uppercase font-bold text-foreground/60">
          Daily Return
        </p>
        <p
          className={`text-2xl font-bold ${
            lastRecord.daily_return >= 0 ? "text-green-600" : "text-red-600"
          }`}
        >
          {(lastRecord.daily_return * 100).toFixed(2)}%
        </p>
      </div>
    </div>
  );
};
