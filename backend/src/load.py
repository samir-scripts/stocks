'''
Connects to the postgresql database
'''

import glob
import os
from dotenv import load_dotenv
from sqlalchemy import create_engine
import pandas as pd

def load_data_to_postgres(engine):
    print("Running to load_data_to_postgres")
    path_to_file = "backend/data/raw/*.parquet"
    files = glob.glob(path_to_file)

    if not files:
        print(f"No files found in {path_to_file}")
        return
    
    print(f"{len(files)} files found, starting load process...")

    for file in files:
        df = pd.read_parquet(file) 
        try:
            df.to_sql(
                name="raw_stocks",
                con=engine,
                if_exists="append",
                index=True
            )
        except Exception as e:
            print(f"Error loading tickers from {file}: {e}")


def main():
    load_dotenv()
    db_url = os.getenv("DATABASE_URL")
    engine = create_engine(db_url)
    print(f"Successfully connected to {db_url}!")
    

    print("Finished running main.")