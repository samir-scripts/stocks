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

# Schedule the pipeline to run daily at midnight
schedule.every().day.at("00:00").do(run_pipeline)
print("Pipeline scheduled to run daily at midnight (00:00).")

# Run the scheduler loop
while True:
    schedule.run_pending()
    time.sleep(1)