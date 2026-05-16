"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { StockDataMap, PerformanceRecord } from "@/lib/data";

interface DashboardContextType {
  tickers: string[];
  selectedTicker: string;
  setSelectedTicker: (ticker: string) => void;
  data: PerformanceRecord[];
  lastRecord: PerformanceRecord | null;
}

const DashboardContext = createContext<DashboardContextType | undefined>(
  undefined,
);

export function DashboardProvider({
  children,
  initialData,
}: {
  children: ReactNode;
  initialData: StockDataMap;
}) {
  const tickers = Object.keys(initialData);
  const [selectedTicker, setSelectedTicker] = useState<string>(
    tickers[0] || "",
  );

  const data = selectedTicker ? initialData[selectedTicker] : [];
  const lastRecord = data.length > 0 ? data[data.length - 1] : null;

  return (
    <DashboardContext.Provider
      value={{
        tickers,
        selectedTicker,
        setSelectedTicker,
        data,
        lastRecord,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboard() {
  const context = useContext(DashboardContext);
  if (context === undefined) {
    throw new Error("useDashboard must be used within a DashboardProvider");
  }
  return context;
}
