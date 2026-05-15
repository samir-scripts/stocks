from flask import Flask, jsonify
from flask_cors import CORS
import duckdb
import os
from extraction import read_tickers, download_data
from transform import transform_data
from load import load_data_to_postgres
from sqlalchemy import create_engine
import pandas as pd


app = Flask(__name__)
# Allow both local dev and Docker frontend
CORS(app, origins=["http://localhost:3000", "http://localhost:5173"])

def get_db_engine():
    db_url = os.getenv("DATABASE_URL")
    return create_engine(db_url)

@app.route("/")
def home():
    return "<h1>Stock API Homepage</h1>"

@app.route("/api/prices/<ticker>")
def get_prices(ticker):
    # Note: This still uses DuckDB as per original code, 
    # but could be migrated to Postgres for consistency.
    print("Executing get_prices...")
    connection = duckdb.connect('../data/stocks.db')
    if connection:
        try:
            print(f"Grabbing data from {ticker}")
            sql_query = "SELECT * FROM prices WHERE ticker = ? ORDER BY date DESC LIMIT 30"
            data = connection.execute(sql_query, [ticker.upper()]).df().to_dict(orient="records")
            return jsonify(data)
        except Exception as e:
            print(f"Something went wrong while trying to fetch data for {ticker}: {e}")
            return jsonify({"error": str(e)}), 500
    else:
        return jsonify({"error": "Connection is empty"}), 500

@app.route("/api/run_pipeline")
def run_pipeline():
    print("Executing run_pipeline (PostgreSQL)...")
    tickers = []
    try:
        read_tickers(tickers)
        downloaded_data = download_data(tickers)
        # In a real scenario, you'd save to parquet then load, 
        # or load directly. For now, we'll follow the script logic.
        engine = get_db_engine()
        
        # This triggers the existing load logic
        load_data_to_postgres(engine)
        
        return jsonify({"status": "success", "message": "Pipeline triggered and loaded to Postgres"})
    except Exception as e:
        print("Something went wrong while trying to execute the pipeline...", e)
        return jsonify({"status": "error", "message": str(e)}), 500

        


