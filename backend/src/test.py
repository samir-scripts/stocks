from extraction import read_tickers, download_data, save_data

def main():
    try:
        tickers = []
        read_tickers(tickers)
        data = download_data(tickers)
        print(data)  
        save_data(data)
    except Exception as e:
        print(f"Something went wrong while trying to execute the test:", e)

main()

