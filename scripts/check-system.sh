#!/bin/bash

# Script to check system requirements

echo "🔍 Checking system requirements..."
echo ""

# Check Node.js
if command -v node &> /dev/null; then
    NODE_VERSION=$(node -v)
    echo "✅ Node.js: $NODE_VERSION"
else
    echo "❌ Node.js not found. Please install Node.js 20+"
    exit 1
fi

# Check npm
if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm -v)
    echo "✅ npm: $NPM_VERSION"
else
    echo "❌ npm not found"
    exit 1
fi

# Check Docker
if command -v docker &> /dev/null; then
    DOCKER_VERSION=$(docker -v)
    echo "✅ Docker: $DOCKER_VERSION"
else
    echo "❌ Docker not found. Please install Docker"
    exit 1
fi

# Check Docker Compose
if command -v docker compose &> /dev/null; then
    echo "✅ Docker Compose: available"
else
    echo "❌ Docker Compose not found"
    exit 1
fi

# Check if ports are available
echo ""
echo "🔌 Checking ports..."

check_port() {
    PORT=$1
    if lsof -Pi :$PORT -sTCP:LISTEN -t >/dev/null 2>&1 ; then
        echo "⚠️  Port $PORT is already in use"
        return 1
    else
        echo "✅ Port $PORT is available"
        return 0
    fi
}

check_port 3000
check_port 5432
check_port 6379

echo ""
echo "🎉 System check complete!"
echo ""
echo "Next steps:"
echo "  1. npm install"
echo "  2. docker compose up -d"
echo "  3. npm run db:migrate"
echo "  4. npm run db:seed"
echo "  5. Open http://localhost:3000"

