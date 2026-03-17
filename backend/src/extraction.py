import yfinance as yf
from datetime import date, timedelta

# this stores the tickers from /data/tickers.txt as a list
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


