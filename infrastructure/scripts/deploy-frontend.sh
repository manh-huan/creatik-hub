#!/bin/bash
set -e

ENVIRONMENT=${1:-staging}

echo "🚀 Deploying frontend to $ENVIRONMENT..."

cd frontend

if [ "$ENVIRONMENT" = "production" ]; then
    echo "🌍 Deploying to production..."
    vercel --prod
else
    echo "🧪 Deploying to staging..."
    vercel
fi

echo "✅ Frontend deployed successfully!"
