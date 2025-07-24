#!/bin/bash

# Usage: ./fix-revealjs.sh
# This will fix all Reveal.js lectures to render properly as presentations

echo "🎯 Fixing all Reveal.js lectures..."
echo "This will render lectures as proper Reveal.js presentations."
echo ""

# Find all .qmd files with revealjs format and render them properly
find files/lecture_notes -name "*.qmd" -exec grep -l "revealjs:" {} \; | while read -r file; do
    echo "📚 Rendering Reveal.js: $file"
    
    # Get the directory structure
    dir=$(dirname "$file")
    base=$(basename "$file" .qmd)
    
    # Create the output directory in docs
    docs_dir="docs/$dir"
    mkdir -p "$docs_dir"
    
    # Render as revealjs to the correct location
    quarto render "$file" --to revealjs --output-dir "docs"
    
    if [ $? -eq 0 ]; then
        # Move the file from the nested location to the correct location
        nested_file="docs/files/lecture_notes/${base}/files/lecture_notes/${base}/${base}.html"
        if [ -f "$nested_file" ]; then
            mv "$nested_file" "$docs_dir/"
            rm -rf "docs/files/lecture_notes/${base}/files"
            echo "✅ Rendered and moved: $base.html"
        else
            echo "✅ Rendered: $base.html"
        fi
    else
        echo "❌ Failed to render: $file"
    fi
done

echo ""
echo "🧹 Cleaning up any remaining nested directories..."
find docs -type d -name "files" -path "*/files/lecture_notes/*/files" -exec rm -rf {} \; 2>/dev/null || true

echo ""
echo "📊 Reveal.js Fix Summary:"
echo "   Reveal.js lectures: $(find docs/files/lecture_notes -name "*.html" | wc -l | tr -d ' ')"
echo "   Total HTML files: $(find docs -name "*.html" | wc -l | tr -d ' ')"
echo ""
echo "🎉 All Reveal.js lectures are now properly rendered as presentations!" 