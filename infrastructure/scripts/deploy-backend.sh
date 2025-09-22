#!/bin/bash
set -e

ENVIRONMENT=${1:-staging}

echo "🚀 Deploying backend to $ENVIRONMENT..."

cd backend

# Build the application
npm run build

if [ "$ENVIRONMENT" = "production" ]; then
    echo "🌍 Deploying to production..."
    # Add production deployment command (Railway, AWS, etc.)
    railway deploy --prod
else
    echo "🧪 Deploying to staging..."
    # Add staging deployment command
    railway deploy
fi

echo "✅ Backend deployed successfully!"
