import { unstable_cache } from 'next/cache';
import pool from './db';

export interface PerformanceRecord {
  time: string;
  value: number;
  moving_avg: number;
  daily_return: number;
}

export interface StockDataMap {
  [ticker: string]: PerformanceRecord[];
}

export const getCachedStockData = unstable_cache(
  async (): Promise<StockDataMap> => {
    console.log('Fetching stock data from database...');
    const query = `
      SELECT 
        ticker,
        price_date, 
        close_price, 
        moving_avg_7_day, 
        daily_return_pct 
      FROM stock_performance 
      ORDER BY ticker ASC, price_date ASC
    `;
    
    const result = await pool.query(query);
    const dataMap: StockDataMap = {};

    result.rows.forEach(row => {
      const ticker = row.ticker;
      if (!dataMap[ticker]) {
        dataMap[ticker] = [];
      }
      
      const timeStr = new Date(row.price_date).toISOString().split('T')[0];
      
      dataMap[ticker].push({
        time: timeStr,
        value: parseFloat(row.close_price),
        moving_avg: parseFloat(row.moving_avg_7_day),
        daily_return: parseFloat(row.daily_return_pct)
      });
    });

    // Deduplicate logic for each ticker if necessary (similar to the previous API route)
    for (const ticker in dataMap) {
      const uniqueDataMap = new Map();
      dataMap[ticker].forEach(item => {
        uniqueDataMap.set(item.time, item);
      });
      dataMap[ticker] = Array.from(uniqueDataMap.values()).sort((a, b) => a.time.localeCompare(b.time));
    }

    return dataMap;
  },
  ['stock-data'],
  {
    tags: ['stock-data'],
  }
);
