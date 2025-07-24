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
quarto render . --to html --no-cache

# Check if build succeeded or failed with file move error
if [ $? -eq 0 ]; then
    echo "✅ Full site rebuild completed successfully!"
elif [ $? -eq 1 ]; then
    echo "⚠️  Build completed with file move error - fixing..."
    
    # Move any HTML files that weren't moved to docs
    echo "📁 Moving HTML files to docs directory..."
    find . -name "*.html" -not -path "./docs/*" -exec mv {} docs/ \; 2>/dev/null || true
    
    echo "✅ Build completed! HTML files moved to docs/"
else
    echo "❌ Build failed. Check the error messages above."
    echo "💡 Try running individual renders if you only need specific files:"
    echo "   ./render-lecture.sh <lecture-name>"
    echo "   ./render-lab.sh <lab-name>"
    echo "   ./render-worksheet.sh <worksheet-name>"
    exit 1
fi

echo ""
echo "📊 Build Summary:"
echo "   Total HTML files: $(find docs -name "*.html" | wc -l | tr -d ' ')"
echo "   Lectures: $(find docs/files/lecture_notes -name "*.html" | wc -l | tr -d ' ')"
echo "   Labs: $(find docs/files/labs -name "*.html" | wc -l | tr -d ' ')"
echo "   Worksheets: $(find docs/files/worksheets -name "*.html" | wc -l | tr -d ' ')"
echo ""
echo "📁 Output available in: docs/" 