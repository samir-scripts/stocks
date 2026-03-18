import pandas as pd

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





