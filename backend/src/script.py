import os
import requests
from extraction import read_tickers, download_data, save_data
from load import main as load_main

def trigger_revalidation():
    """Triggers the frontend to revalidate its cache."""
    frontend_url = os.getenv("FRONTEND_URL", "http://frontend:3000")
    secret = os.getenv("REVALIDATION_SECRET")
    
    if not secret:
        print("REVALIDATION_SECRET not set. Skipping revalidation.")
        return

    try:
        url = f"{frontend_url}/api/revalidate?secret={secret}"
        response = requests.post(url)
        if response.status_code == 200:
            print("Successfully triggered frontend revalidation.")
        else:
            print(f"Failed to trigger revalidation. Status: {response.status_code}, Response: {response.text}")
    except Exception as e:
        print(f"Error triggering revalidation: {e}")

def run_pipeline():
    """Executes the data pipeline: fetching data, saving, and loading."""
    print("Starting data pipeline execution...")
    tickers = []
    read_tickers(tickers)
    data = download_data(tickers)
    save_data(data)
    load_main()
    print("Data pipeline execution finished.")
    trigger_revalidation()

if __name__ == "__main__":
    run_pipeline()
