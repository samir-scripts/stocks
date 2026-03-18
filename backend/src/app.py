from flask import Flask, jsonify, request
from flask_cors import CORS
import duckdb
from extraction import read_tickers, download_data
from transform import transform_data
from load import create_table, upsert_data
import pandas as pd


app = Flask(__name__)
CORS(app, origins=["http://localhost:5173"])

@app.route("/")
def home():
    return "<h1>Homepage</h1>"

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
    connection = duckdb.connect('../data/stocks.db')
    tickers = []
    try:
        read_tickers(tickers)
        downloaded_data = download_data(tickers)
        cleaned_data = transform_data(downloaded_data)
        create_table(connection)
        upsert_data(connection, cleaned_data)
        print("Finished executing pipeline...")
        jsonified_data = cleaned_data.to_json
        return jsonify({"status": "success", "message": str(jsonified_data)})
    except Exception as e:
        print("Something went wrong while trying to execute the pipeline...", e)
        return jsonify({"status": "error", "message": str(e)})

        


