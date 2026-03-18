'''
dont run this script in production
'''


import yfinance as yf
from datetime import date, timedelta
import pandas as pd
import duckdb


def read_tickers(tickers):
    try:
        with open("../data/tickers.txt", "r") as file:
            for line in file:
                cleaned_line = line.strip().upper()
                if cleaned_line:
                    tickers.append(cleaned_line)

        print(tickers)
    except Exception as e:
        print(f"Something went wrong...", e)
    
# using the tickers grabbed by read_tickers, the data of each ticker in the list is downloaded from yfinance
def download_data(tickers):
    print("downloading data from yfinance...")
    
    if tickers:
        # sliding window of 30 days to get data from yfinance
        end_date = date.today()
        start_date = end_date - timedelta(days=30)
        try:
            return yf.download(tickers, start=start_date, end=end_date)
        except Exception as e:
            print(f"Something went wrong while trying to download data from yfinance: ", e)
    else:
        print("no data in tickers!")

def transform_data(data):
    if data is not None and not data.empty:
        df = pd.DataFrame(data=data).stack(level=1)
        df = df.reset_index()
        cleaned_data = df.rename(columns=
        {
            "Date": "date",
            "Ticker": "ticker",
            "Close": "close",
            "High": "high",
            "Low": "low",
            "Open": "open",
            "Volume": "volume"
        })
        
        return cleaned_data.dropna()
    else:
        print("There is no data to be cleaned")
        return pd.DataFrame()
    


connection = duckdb.connect('../data/stocks.db')

def create_table(connection):
    print("Creating table...")
    if connection:
        try:
            # connection.sql("CREATE TABLE IF NOT EXISTS prices (date DATE, ticker VARCHAR, price DOUBLE, close DOUBLE, high DOUBLE, low DOUBLE, open DOUBLE, volume INTEGER, PRIMARY KEY (date, ticker));")
            connection.sql("CREATE TABLE IF NOT EXISTS prices (date DATE, ticker VARCHAR, close DOUBLE, high DOUBLE, low DOUBLE, open DOUBLE, volume INTEGER, PRIMARY KEY (date, ticker));")
        except Exception as e:
            print(f"Something went wrong while trying to create the table...", e)
    else:
        print("Connection and cleaned_data are empty...")
    

def upsert_data(connection, transformed_data):
    print("Upserting data into table...")
    if connection:
        try:
            # making sure there are no duplicates
            transformed_data
            connection.sql("INSERT INTO prices SELECT * FROM transformed_data ON CONFLICT (date, ticker) DO NOTHING")
        except Exception as e:
            print("Something went wrong when trying to upsert data into the database", e)
    else:
        print("Connection or data is empty")

tickers = []

read_tickers(tickers)
data = download_data(tickers)
transformed_data = transform_data(data)
print(transformed_data)
create_table(connection)
upsert_data(connection, transformed_data)


