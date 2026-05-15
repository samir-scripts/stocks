#!/bin/bash

# Log file
LOG_FILE="/app/src/cron.log"

echo "------------------------------------------" >> "$LOG_FILE"
echo "Job started at: $(date)" >> "$LOG_FILE"

# Run the data pipeline
echo "Running data pipeline..." >> "$LOG_FILE"
cd /app/src
python script.py >> "$LOG_FILE" 2>&1

# Run dbt
echo "Running dbt..." >> "$LOG_FILE"
cd /app/analytics
dbt run >> "$LOG_FILE" 2>&1

echo "Job finished at: $(date)" >> "$LOG_FILE"
