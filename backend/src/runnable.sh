#!/bin/bash

# Get the directory of the script
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PROJECT_ROOT="$( cd "$SCRIPT_DIR/../.." && pwd )"

# Log file
LOG_FILE="$SCRIPT_DIR/cron.log"

echo "------------------------------------------" >> "$LOG_FILE"
echo "Job started at: $(date)" >> "$LOG_FILE"

# Activate virtual environment
if [ -f "$PROJECT_ROOT/.venv/bin/activate" ]; then
    source "$PROJECT_ROOT/.venv/bin/activate"
else
    echo "Virtual environment not found at $PROJECT_ROOT/.venv" >> "$LOG_FILE"
    exit 1
fi

# Run the data pipeline
echo "Running data pipeline..." >> "$LOG_FILE"
cd "$SCRIPT_DIR"
python script.py >> "$LOG_FILE" 2>&1

# Run dbt
echo "Running dbt..." >> "$LOG_FILE"
cd "$PROJECT_ROOT/backend/analytics"
dbt run >> "$LOG_FILE" 2>&1

echo "Job finished at: $(date)" >> "$LOG_FILE"
