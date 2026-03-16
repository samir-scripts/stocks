import pandas as pd
import numpy as np
import duckdb
from extraction import read_tickers, download_data

def transform_data(data):
    if data:
        df = pd.DataFrame(data=data)
        flat_data = df.stack(level=1).dropna()
        cleaned_data = flat_data.rename(columns=
        {
            "Price": "price", 
            "Date": "date",
            "Ticker": "ticker",
            "Close": "close",
            "High": "high",
            "Low": "low",
            "Open": "open",
            "Volume": "volume"    
        })
        return cleaned_data
    else:
        print("There is no data to be cleaned")




