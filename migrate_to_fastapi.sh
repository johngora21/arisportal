#!/bin/bash

# Flask to FastAPI Migration Script

echo "🔄 Migrating from Flask to FastAPI..."

# Backup existing Flask files
echo "📦 Creating backup of Flask files..."
mkdir -p backup/flask_backend
cp -r routes/ backup/flask_backend/ 2>/dev/null || true
cp app.py backup/flask_backend/ 2>/dev/null || true
cp requirements.txt backup/flask_backend/requirements_flask.txt 2>/dev/null || true

echo "✅ Flask files backed up to backup/flask_backend/"

# Remove old Flask files (optional - comment out if you want to keep them)
echo "🗑️ Removing old Flask files..."
# rm -rf routes/  # Uncomment to remove old Flask routes
# rm app.py       # Uncomment to remove old Flask app

echo "✅ Migration completed!"
echo ""
echo "🚀 To start the new FastAPI backend:"
echo "   ./start_fastapi_backend.sh"
echo ""
echo "📚 API Documentation will be available at:"
echo "   http://localhost:5000/docs"
echo ""
echo "🔍 Interactive API Explorer:"
echo "   http://localhost:5000/redoc"
