#!/bin/bash

# Usage: ./render-revealjs.sh
# This will render all Reveal.js lectures and organize them properly

echo "🎯 Rendering all Reveal.js lectures..."
echo "This will render lectures as presentations and organize them properly."
echo ""

# Find all .qmd files with revealjs format
find files/lecture_notes -name "*.qmd" -exec grep -l "revealjs:" {} \; | while read -r file; do
    echo "📚 Rendering: $file"
    
    # Get the directory structure
    dir=$(dirname "$file")
    base=$(basename "$file" .qmd)
    
    # Create the output directory in docs
    docs_dir="docs/$dir"
    mkdir -p "$docs_dir"
    
    # Render as revealjs
    quarto render "$file" --to revealjs --output-dir "docs"
    
    if [ $? -eq 0 ]; then
        echo "✅ Rendered: $base.html"
    else
        echo "❌ Failed to render: $file"
    fi
done

echo ""
echo "🧹 Cleaning up scattered HTML files..."
# Move any HTML files from docs root to their proper locations
find docs -maxdepth 1 -name "*.html" | while read -r file; do
    base=$(basename "$file")
    name=$(basename "$file" .html)
    
    # Check if this is a lecture file
    if [[ "$name" == lecture* ]]; then
        # Find the corresponding source file
        source_file=$(find files/lecture_notes -name "${name}.qmd" | head -1)
        if [ -n "$source_file" ]; then
            target_dir="docs/$(dirname "$source_file")"
            mkdir -p "$target_dir"
            mv "$file" "$target_dir/"
            echo "📁 Moved: $base → $target_dir/"
        fi
    fi
done

echo ""
echo "📊 Reveal.js Rendering Summary:"
echo "   Lectures rendered: $(find docs/files/lecture_notes -name "*.html" | wc -l | tr -d ' ')"
echo "   Total HTML files: $(find docs -name "*.html" | wc -l | tr -d ' ')"
echo ""
echo "🎉 Reveal.js lectures are now properly organized!" 