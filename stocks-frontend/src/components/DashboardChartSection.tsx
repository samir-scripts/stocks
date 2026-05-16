"use client";

import React from "react";
import { StockChart } from "@/components/StockChart";
import { PerformanceRecord } from "@/lib/data";

interface DashboardChartSectionProps {
  data: PerformanceRecord[];
}

export const DashboardChartSection: React.FC<DashboardChartSectionProps> = ({
  data,
}) => {
  const chartData = data.map((item) => ({
    time: item.time,
    value: item.value,
  }));
  const movingAvgData = data.map((item) => ({
    time: item.time,
    value: item.moving_avg,
  }));

  return (
    <div className="relative min-h-100">
      {data.length > 0 ? (
        <StockChart data={chartData} movingAvgData={movingAvgData} />
      ) : (
        <div className="h-100 flex items-center justify-center border-2 border-dashed border-academic-gray/20 rounded-lg">
          <p className="text-academic-gray/40">
            No data available for this ticker.
          </p>
        </div>
      )}
    </div>
  );
};
