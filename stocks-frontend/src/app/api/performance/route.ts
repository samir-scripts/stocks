import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const ticker = searchParams.get('ticker');

  if (!ticker) {
    return NextResponse.json({ error: 'Ticker is required' }, { status: 400 });
  }

  try {
    const query = `
      SELECT 
        price_date, 
        close_price, 
        moving_avg_7_day, 
        daily_return_pct 
      FROM stock_performance 
      WHERE ticker = $1 
      ORDER BY price_date ASC
    `;
    const result = await pool.query(query, [ticker.toUpperCase()]);
    
    // Deduplicate and transform data for Lightweight Charts
    // Lightweight Charts expects strictly ascending { time: 'YYYY-MM-DD', value: number } with unique times
    const uniqueDataMap = new Map();
    
    result.rows.forEach(row => {
      const timeStr = new Date(row.price_date).toISOString().split('T')[0];
      // By setting into a Map, we overwrite any duplicates for the same day with the latest one encountered
      uniqueDataMap.set(timeStr, {
        time: timeStr,
        value: parseFloat(row.close_price),
        moving_avg: parseFloat(row.moving_avg_7_day),
        daily_return: parseFloat(row.daily_return_pct)
      });
    });

    // Convert map values to array and ensure strictly ascending order
    const performanceData = Array.from(uniqueDataMap.values()).sort((a, b) => a.time.localeCompare(b.time));

    return NextResponse.json(performanceData);
  } catch (error) {
    console.error('Error fetching performance data:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
