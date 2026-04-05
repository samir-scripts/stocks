import glob
import os
from dotenv import load_dotenv
from sqlalchemy import create_engine


def main():

    load_dotenv()
    db_url = os.getenv("DATABASE_URL")
    engine = create_engine(db_url)
    print(f"Successfully connected to {db_url}!")
    

    print("Finished running main.")