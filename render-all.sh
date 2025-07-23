#!/bin/bash

# Usage: ./render-all.sh
# This will render the entire site (full rebuild)

echo "🚀 Starting full site rebuild..."
echo "This will render all lectures, labs, worksheets, and site pages."
echo ""

# Clean previous outputs
echo "🧹 Cleaning previous outputs..."
rm -rf docs _site

# Render the entire site
echo "📚 Rendering entire site..."
quarto render .

echo ""
if [ $? -eq 0 ]; then
    echo "✅ Full site rebuild completed successfully!"
    echo "📁 Output available in: docs/"
else
    echo "❌ Build failed. Check the error messages above."
    echo "💡 Try running individual renders if you only need specific files:"
    echo "   ./render-lecture.sh <lecture-name>"
    echo "   ./render-lab.sh <lab-name>"
    echo "   ./render-worksheet.sh <worksheet-name>"
fi 