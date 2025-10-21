#!/bin/bash

# Inventory Backend Setup Script

echo "Setting up Inventory Backend..."

# Create virtual environment
python3 -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create database
mysql -u root -e "CREATE DATABASE IF NOT EXISTS inventory_db;"

echo "Inventory backend setup complete!"
echo "To start the server, run:"
echo "source venv/bin/activate && python app.py"
