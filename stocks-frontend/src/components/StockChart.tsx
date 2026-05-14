'use client';

import { createChart, ColorType, ISeriesApi, LineSeries } from 'lightweight-charts';
import React, { useEffect, useRef } from 'react';

interface ChartProps {
  data: { time: string; value: number }[];
  movingAvgData?: { time: string; value: number }[];
}

export const StockChart: React.FC<ChartProps> = ({ data, movingAvgData }) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<any>(null);
  const lineSeriesRef = useRef<ISeriesApi<"Line"> | null>(null);
  const movingAvgSeriesRef = useRef<ISeriesApi<"Line"> | null>(null);

  useEffect(() => {
    if (!chartContainerRef.current) return;

    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: '#FFFFFF' },
        textColor: '#1E293B', // academic-gray
        fontFamily: 'var(--font-jetbrains-mono), monospace',
      },
      grid: {
        vertLines: { color: '#F1F5F9' },
        horzLines: { color: '#F1F5F9' },
      },
      width: chartContainerRef.current.clientWidth,
      height: 400,
    });

    chart.timeScale().fitContent();

    // Use v5 unified series creation API: chart.addSeries(LineSeries, options)
    const lineSeries = chart.addSeries(LineSeries, {
      color: '#3B82F6', // primary-blue
      lineWidth: 2,
      title: 'Close Price',
    });
    lineSeriesRef.current = lineSeries;

    if (movingAvgData) {
      const movingAvgSeries = chart.addSeries(LineSeries, {
        color: '#4A90E2', // blueprint-blue
        lineWidth: 1,
        lineStyle: 2, // Dashed
        title: '7-Day MA',
      });
      movingAvgSeriesRef.current = movingAvgSeries;
    }

    chartRef.current = chart;

    const handleResize = () => {
      chart.applyOptions({ width: chartContainerRef.current?.clientWidth });
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      chart.remove();
    };
  }, []);

  useEffect(() => {
    if (lineSeriesRef.current && data.length > 0) {
      lineSeriesRef.current.setData(data);
    }
    if (movingAvgSeriesRef.current && movingAvgData && movingAvgData.length > 0) {
      movingAvgSeriesRef.current.setData(movingAvgData);
    }
    if (chartRef.current) {
        chartRef.current.timeScale().fitContent();
    }
  }, [data, movingAvgData]);

  return <div ref={chartContainerRef} className="w-full chart-container overflow-hidden" />;
};
