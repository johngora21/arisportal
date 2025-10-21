#!/bin/bash

# FastAPI Suppliers Backend Startup Script

echo "🚀 Starting FastAPI Suppliers Backend..."

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo "📦 Creating virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
echo "🔧 Activating virtual environment..."
source venv/bin/activate

# Install requirements
echo "📥 Installing requirements..."
pip install -r requirements_fastapi.txt

# Create database tables
echo "🗄️ Creating database tables..."
python3 -c "
from suppliers_api import engine, Base
Base.metadata.create_all(bind=engine)
print('✅ Database tables created successfully')
"

# Start the FastAPI server
echo "🌐 Starting FastAPI server on http://localhost:8000"
echo "📚 API Documentation available at http://localhost:8000/docs"
echo "🔍 Interactive API explorer at http://localhost:8000/redoc"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

uvicorn suppliers_api:app --host 0.0.0.0 --port 8000 --reload
