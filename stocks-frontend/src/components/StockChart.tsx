'use client';

import { createChart, ColorType, ISeriesApi, LineSeries, IChartApi } from 'lightweight-charts';
import React, { useEffect, useRef, useState } from 'react';
import { useTheme } from 'next-themes';

interface ChartProps {
  data: { time: string; value: number }[];
  movingAvgData?: { time: string; value: number }[];
}

export const StockChart: React.FC<ChartProps> = ({ data, movingAvgData }) => {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const lineSeriesRef = useRef<ISeriesApi<"Line"> | null>(null);
  const movingAvgSeriesRef = useRef<ISeriesApi<"Line"> | null>(null);

  useEffect(() => {
    setMounted(true); // eslint-disable-line react-hooks/set-state-in-effect
  }, []);

  useEffect(() => {
    if (!mounted || !chartContainerRef.current) return;

    const isDark = theme === 'dark';
    const backgroundColor = isDark ? '#121212' : '#FFFFFF';
    const textColor = isDark ? '#F8FAFC' : '#1E293B';
    const gridColor = isDark ? '#1E293B' : '#F1F5F9';

    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: backgroundColor },
        textColor: textColor,
        fontFamily: 'var(--font-jetbrains-mono), monospace',
      },
      grid: {
        vertLines: { color: gridColor },
        horzLines: { color: gridColor },
      },
      width: chartContainerRef.current.clientWidth,
      height: 400,
    });

    chart.timeScale().fitContent();

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
  }, [mounted, theme, movingAvgData]);

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
  }, [data, movingAvgData, theme]);

  return <div ref={chartContainerRef} className="w-full chart-container overflow-hidden" />;
};
