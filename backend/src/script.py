from extraction import read_tickers, download_data, save_data
from load import main as load_main
import schedule
import time

def run_pipeline():
    """Executes the data pipeline: fetching data, saving, and loading."""
    print("Starting data pipeline execution...")
    tickers = []
    read_tickers(tickers)
    data = download_data(tickers)
    save_data(data)
    load_main()
    print("Data pipeline execution finished.")

run_pipeline()

