#!/bin/bash

# FastAPI ArisPortal Backend Startup Script

echo "🚀 Starting FastAPI ArisPortal Backend..."

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
pip install -r requirements.txt

# Create database tables
echo "🗄️ Creating database tables..."
python3 -c "
from database import engine, Base
from models.user import User
from models.supplier import Supplier
Base.metadata.create_all(bind=engine)
print('✅ Database tables created successfully')
"

# Start the FastAPI server
echo "🌐 Starting FastAPI server on http://localhost:5000"
echo "📚 API Documentation available at http://localhost:5000/docs"
echo "🔍 Interactive API explorer at http://localhost:5000/redoc"
echo ""
echo "Available endpoints:"
echo "  - Authentication: /api/v1/auth/"
echo "  - Properties: /api/v1/properties/"
echo "  - Investments: /api/v1/investments/"
echo "  - Finance: /api/v1/finance/"
echo "  - Inventory: /api/v1/inventory/"
echo "  - Suppliers: /api/v1/suppliers/"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

uvicorn main:app --host 0.0.0.0 --port 5000 --reload
