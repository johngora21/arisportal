#!/bin/bash

echo "🎨 Starting ArisPortal Frontend..."

# Change to frontend directory
cd frontend

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Start Next.js development server from the frontend directory
echo "🌟 Starting Next.js server on port 4000..."
npm run dev -- -p 4000
