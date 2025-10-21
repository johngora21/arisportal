#!/bin/bash

# Aris Portal Backend Startup Script

echo "Starting Aris Portal Backend..."

# Check if virtual environment exists
if [ ! -d "invoice_env" ]; then
    echo "Creating virtual environment..."
    python3 -m venv invoice_env
fi

# Activate virtual environment
echo "Activating virtual environment..."
source invoice_env/bin/activate

# Install dependencies
echo "Installing dependencies..."
pip install -r requirements.txt

# Initialize database
echo "Initializing database..."
python init_db.py

# Start Flask application
echo "Starting Flask application..."
python app.py
