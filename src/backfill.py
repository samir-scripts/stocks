from extraction import read_tickers, download_data
from transform import transform_data
from load import create_table, upsert_data

tickers = []

def backfill(tickers):
    print("backfilling data...")
    read_tickers(tickers)
    data = download_data(tickers)
    transformed_data = transform_data(data)
    print(transformed_data)








