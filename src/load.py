import duckdb


connection = duckdb.connect('../data/stocks.db')

def create_table(connection):
    print("Creating table...")
    if connection:
        try:
            connection.sql("CREATE TABLE IF NOT EXISTS prices (date DATE, ticker VARCHAR, price DOUBLE, close DOUBLE, high DOUBLE, low DOUBLE, open DOUBLE, volume INTEGER, PRIMARY KEY (date, ticker));")
        except Exception as e:
            print(f"Something went wrong while trying to create the table...", e)
    else:
        print("Connection and cleaned_data are empty...")
    

def upsert_data(connection, transformed_data):
    print("Upserting data into table...")
    if connection and transformed_data:
        try:
            # making sure there are no duplicates
            connection.sql("INSERT INTO prices SELECT * FROM transformed_data ON CONFLICT (date, ticker) DO NOTHING")
        except Exception as e:
            print("Something went wrong when trying to upsert data into the database", e)
    else:
        print("Connection or data is empty")






