#!/bin/bash

# HealthPal Web - Vercel Deployment Script
# This script prepares and deploys the Next.js app to Vercel

set -e

echo "🚀 Starting HealthPal Web deployment to Vercel..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    print_error "package.json not found. Please run this script from the healthpal-web directory."
    exit 1
fi

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    print_warning "Vercel CLI not found. Installing..."
    npm install -g vercel
fi

print_status "Running pre-deployment checks..."

# Check for required files
required_files=(
    "next.config.ts"
    "vercel.json"
    ".env.production"
    "public/manifest.json"
    "public/robots.txt"
    "public/logo.svg"
)

for file in "${required_files[@]}"; do
    if [ ! -f "$file" ]; then
        print_error "Required file missing: $file"
        exit 1
    fi
done

print_status "All required files present ✓"

# Run type checking
print_status "Running TypeScript type checking..."
npm run type-check

# Run linting
print_status "Running ESLint..."
npm run lint

# Run build test
print_status "Testing production build..."
npm run build

print_status "Build successful ✓"

# Deploy to Vercel
print_status "Deploying to Vercel..."

# First deployment (creates project)
if [ ! -f ".vercel/project.json" ]; then
    print_status "First deployment - creating Vercel project..."
    vercel --prod
else
    print_status "Deploying to existing project..."
    vercel --prod
fi

print_status "🎉 Deployment completed!"

echo ""
echo "📋 Post-deployment checklist:"
echo "1. ✓ Set environment variables in Vercel dashboard"
echo "2. ✓ Update backend CORS settings to include your Vercel domain"
echo "3. ✓ Test all functionality on the deployed site"
echo "4. ✓ Set up custom domain (optional)"
echo "5. ✓ Configure monitoring and analytics"

echo ""
echo "🔗 Useful links:"
echo "- Vercel Dashboard: https://vercel.com/dashboard"
echo "- Project Settings: https://vercel.com/[your-username]/healthpal-web/settings"
echo "- Environment Variables: https://vercel.com/[your-username]/healthpal-web/settings/environment-variables"

echo ""
print_status "Deployment script completed successfully!"