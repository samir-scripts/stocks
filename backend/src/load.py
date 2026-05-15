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
    # Inside Docker, we use /app as the root. 
    # Relative path ../../backend/data/raw/ wouldn't work correctly.
    path_to_file = "/app/data/raw/*.parquet"
    files = glob.glob(path_to_file)

    if not files:
        print(f"No files found in {path_to_file}. Trying relative path...")
        path_to_file = "data/raw/*.parquet"
        files = glob.glob(path_to_file)

    if not files:
        print("Final check: No parquet files found for loading.")
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

    try:
        db_url = os.getenv("DATABASE_URL")
        engine = create_engine(db_url)
        print(f"Successfully connected to {db_url}!")
    except Exception as e:
        print(f"Something went wrong while trying to connnect to the database: {e}")


    load_data_to_postgres(engine)
    

    print("Finished running main.")

if __name__ == "__main__":
    main()
