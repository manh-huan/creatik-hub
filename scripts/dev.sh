#!/bin/bash
set -e

echo "🚀 Starting development servers..."

# Check if .env exists
if [ ! -f .env ]; then
    echo "❌ .env file not found. Please run ./scripts/setup.sh first"
    exit 1
fi

# Start services with Docker Compose
if command -v docker-compose &> /dev/null; then
    echo "🐳 Starting with Docker..."
    docker-compose up --build
else
    echo "📦 Starting with npm..."
    npm run dev
fi
