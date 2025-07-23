#!/bin/bash

# Usage: ./render-preview.sh
# This will start a live preview server for development

echo "🔍 Starting Quarto preview server..."
echo "This will watch for changes and automatically rebuild affected files."
echo "Press Ctrl+C to stop the server."
echo ""

# Start the preview server
quarto preview . --no-browser

echo ""
echo "👋 Preview server stopped." 