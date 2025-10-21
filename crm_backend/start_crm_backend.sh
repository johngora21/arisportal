#!/bin/bash

# CRM Backend Startup Script

echo "Starting CRM Backend..."

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
echo "Activating virtual environment..."
source venv/bin/activate

# Install dependencies
echo "Installing dependencies..."
pip install -r requirements.txt

# Initialize database
echo "Initializing CRM database..."
python init_crm_db.py

# Start Flask application
echo "Starting Flask application..."
python app.py
