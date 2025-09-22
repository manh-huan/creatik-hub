#!/bin/bash
set -e

echo "🚀 Setting up Text-to-Video App..."

# Install root dependencies
echo "📦 Installing root dependencies..."
npm install

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
cd frontend && npm install && cd ..

# Install backend dependencies  
echo "📦 Installing backend dependencies..."
cd backend && npm install && cd ..

# Install shared dependencies
echo "📦 Installing shared dependencies..."
cd shared && npm install && npm run build && cd ..

# Copy environment file
if [ ! -f .env ]; then
    cp .env.example .env
    echo "📝 Created .env file - please configure your API keys"
else
    echo "📝 .env file already exists"
fi

echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Configure your .env file with API keys"
echo "2. Run 'npm run dev' to start development servers"
echo "3. Visit http://localhost:3000 to see your app"
