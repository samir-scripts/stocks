import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET() {
  try {
    const result = await pool.query('SELECT DISTINCT ticker FROM stock_performance ORDER BY ticker ASC');
    const tickers = result.rows.map(row => row.ticker);
    return NextResponse.json(tickers);
  } catch (error) {
    console.error('Error fetching tickers:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
