import yfinance as yf
import numpy as np
import pandas as pd

tickers = []

def read_tickers(tickers):
    try:
        with open("../data/tickers.txt", "r") as file:
            for line in file:
                print(line)
                tickers.append(line.strip())

        print(tickers)
    except Exception as e:
        print(f"Something went wrong...", e)


read_tickers(tickers)