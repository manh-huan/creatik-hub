#!/bin/bash

echo "🔧 Environment setup wizard..."

# Create .env file if it doesn't exist
if [ ! -f ../.env ]; then
    cp ../.env.example ../.env
    echo "📝 Created .env file"
fi

echo ""
echo "Please configure the following environment variables in .env:"
echo ""
echo "🤖 AI API Keys:"
echo "- RUNWAY_API_KEY (get from runwayml.com)"
echo "- REPLICATE_API_TOKEN (get from replicate.com)" 
echo "- OPENAI_API_KEY (get from openai.com)"
echo ""
echo "☁️  Storage:"
echo "- AWS_ACCESS_KEY_ID (AWS S3)"
echo "- AWS_SECRET_ACCESS_KEY (AWS S3)"
echo "- CLOUDFLARE_R2_ACCESS_KEY (CloudFlare R2)"
echo "- CLOUDFLARE_R2_SECRET_KEY (CloudFlare R2)"
echo ""
echo "💳 Payments:"
echo "- STRIPE_PUBLISHABLE_KEY (Stripe)"
echo "- STRIPE_SECRET_KEY (Stripe)"
echo ""
echo "🔒 Security:"
echo "- JWT_SECRET (random secure string)"
echo "- NEXTAUTH_SECRET (random secure string)"
echo ""

read -p "Open .env file for editing? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    ${EDITOR:-nano} ../.env
fi
