#!/bin/bash

# Deployment script for DrinkInflu

set -e

echo "🚀 Starting deployment..."
echo ""

# Load environment
ENV=${1:-production}
echo "📦 Environment: $ENV"
echo ""

# Pull latest code
echo "📥 Pulling latest code..."
git pull origin main
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm ci
echo ""

# Build Docker images
echo "🐳 Building Docker images..."
docker compose build
echo ""

# Stop old containers
echo "⏹️  Stopping old containers..."
docker compose down
echo ""

# Start new containers
echo "▶️  Starting new containers..."
docker compose up -d
echo ""

# Wait for database
echo "⏳ Waiting for database..."
sleep 10
echo ""

# Run migrations
echo "🗄️  Running database migrations..."
npm run db:migrate
echo ""

# Check health
echo "🏥 Checking health..."
sleep 5

if curl -f http://localhost:3000 > /dev/null 2>&1; then
    echo "✅ Application is healthy!"
else
    echo "❌ Application health check failed"
    echo "📋 Checking logs..."
    docker compose logs --tail=50 web
    exit 1
fi

echo ""
echo "🎉 Deployment complete!"
echo ""
echo "🌐 Application: http://localhost:3000"
echo "📊 Database Studio: npm run db:studio"
echo "📋 Logs: docker compose logs -f"

