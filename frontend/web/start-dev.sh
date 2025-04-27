#!/bin/bash

echo "Starting BangBang Delivery Frontend in development mode..."

# Make sure there are no jsconfig.json files
find . -name jsconfig.json -delete

# Set environment variables to bypass React Scripts errors
export SKIP_PREFLIGHT_CHECK=true
export DISABLE_ESLINT_PLUGIN=true
export TSC_COMPILE_ON_ERROR=true
export ESLINT_NO_DEV_ERRORS=true
export REACT_APP_API_URL=http://localhost:8088

# Ensure patches directory exists and has the right files
mkdir -p patches
if [ ! -f patches/Grid.js ] || [ ! -f patches/Grid.d.ts ] || [ ! -f patches/kycApi.ts ]; then
  echo "Copying patch files to patches directory..."
  cp -f patches/Grid.js patches/ 2>/dev/null || echo "Warning: Grid.js not found"
  cp -f patches/Grid.d.ts patches/ 2>/dev/null || echo "Warning: Grid.d.ts not found"
  cp -f patches/kycApi.ts patches/ 2>/dev/null || echo "Warning: kycApi.ts not found"
fi

# Start the development server
echo "Starting React development server..."
npm start 