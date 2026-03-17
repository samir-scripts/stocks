from flask import Flask, jsonify, request 
import duckdb
from extraction import read_tickers, download_data
from load import create_table, upsert_data


app = Flask(__name__)

@app.route("/api/prices/<ticker>")
def get_prices(ticker):
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
    else:
        print("Connection is empty")


@app.route("/api/run_pipeline")
def run_pipeline():
    print("Executing run_pipeline...")

        


