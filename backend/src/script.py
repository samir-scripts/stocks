from extraction import read_tickers, download_data, save_data
from load import main as load_main

def script():
    tickers = []
    read_tickers(tickers)
    data = download_data(tickers)
    save_data(data)
    load_main()

if __name__ == "__main__":
    script()

