#!/bin/bash

# Text, Image, and Multi-Image to 3D Object Generator
# Quick Start Script

echo "🧠 Text, Image & Multi-Image to 3D Object Generator"
echo "=================================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    echo "   Visit: https://nodejs.org/"
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "⚠️  Node.js version $NODE_VERSION detected. Please upgrade to Node.js 18+."
    echo "   Visit: https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js $(node -v) detected"

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
    if [ $? -ne 0 ]; then
        echo "❌ Failed to install dependencies"
        exit 1
    fi
    echo "✅ Dependencies installed successfully"
else
    echo "✅ Dependencies already installed"
fi

# Create .env.local if it doesn't exist
if [ ! -f ".env.local" ]; then
    echo "🔧 Creating environment configuration..."
    cat > .env.local << EOF
# Text, Image & Multi-Image to 3D Object Generator
# Environment Configuration

# API Configuration (Optional - using mock data for demo)
NEXT_PUBLIC_LV_API_URL=https://api.example.com
NEXT_PUBLIC_LV_API_KEY=demo_key
NEXT_PUBLIC_STORAGE_BUCKET=demo_bucket
NEXT_PUBLIC_REGION=us-east-1

# Development Settings
NODE_ENV=development
EOF
    echo "✅ Environment configuration created"
fi

echo ""
echo "🚀 Starting development server..."
echo "   The application will be available at: http://localhost:3000"
echo ""
echo "📖 Features:"
echo "   • Text to 3D: Generate models from descriptions"
echo "   • Image to 3D: Convert photos to 3D objects"
echo "   • Multi-Image: Use multiple angles for better quality"
echo "   • Interactive 3D Viewer with controls"
echo "   • GLB file download"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

# Start the development server
npm run dev
