#!/bin/bash

# Usage: ./organize-docs.sh
# This will organize all HTML files in docs to match the source files structure

echo "📁 Organizing docs folder structure..."
echo "This will move HTML files to match the source files organization."
echo ""

# Create the main directories if they don't exist
mkdir -p docs/files/lecture_notes
mkdir -p docs/files/labs
mkdir -p docs/files/worksheets
mkdir -p docs/files/resources

echo "🧹 Moving lecture files..."
# Move lecture files to their proper locations
find docs -maxdepth 1 -name "lecture*.html" | while read -r file; do
    base=$(basename "$file" .html)
    
    # Find the corresponding source file
    source_file=$(find files/lecture_notes -name "${base}.qmd" | head -1)
    if [ -n "$source_file" ]; then
        target_dir="docs/$(dirname "$source_file")"
        mkdir -p "$target_dir"
        mv "$file" "$target_dir/"
        echo "📚 Moved: $base.html → $target_dir/"
    fi
done

echo ""
echo "🧹 Moving lab files..."
# Move lab files to their proper locations
find docs -maxdepth 1 -name "lab*.html" | while read -r file; do
    base=$(basename "$file" .html)
    
    # Find the corresponding source file
    source_file=$(find files/labs -name "${base}.qmd" | head -1)
    if [ -n "$source_file" ]; then
        target_dir="docs/$(dirname "$source_file")"
        mkdir -p "$target_dir"
        mv "$file" "$target_dir/"
        echo "🔬 Moved: $base.html → $target_dir/"
    fi
done

echo ""
echo "🧹 Moving worksheet files..."
# Move worksheet files to their proper locations
find docs -maxdepth 1 -name "worksheet*.html" | while read -r file; do
    base=$(basename "$file" .html)
    
    # Find the corresponding source file
    source_file=$(find files/worksheets -name "${base}.qmd" | head -1)
    if [ -n "$source_file" ]; then
        target_dir="docs/$(dirname "$source_file")"
        mkdir -p "$target_dir"
        mv "$file" "$target_dir/"
        echo "📝 Moved: $base.html → $target_dir/"
    fi
done

echo ""
echo "🧹 Moving other files..."
# Move other specific files
for file in docs/q*.html docs/*_worksheet.html docs/*_sln.html; do
    if [ -f "$file" ]; then
        base=$(basename "$file" .html)
        
        # Find the corresponding source file
        source_file=$(find files -name "${base}.qmd" | head -1)
        if [ -n "$source_file" ]; then
            target_dir="docs/$(dirname "$source_file")"
            mkdir -p "$target_dir"
            mv "$file" "$target_dir/"
            echo "📄 Moved: $base.html → $target_dir/"
        fi
    fi
done

echo ""
echo "📊 Organization Summary:"
echo "   Lectures: $(find docs/files/lecture_notes -name "*.html" | wc -l | tr -d ' ')"
echo "   Labs: $(find docs/files/labs -name "*.html" | wc -l | tr -d ' ')"
echo "   Worksheets: $(find docs/files/worksheets -name "*.html" | wc -l | tr -d ' ')"
echo "   Resources: $(find docs/files/resources -name "*.html" | wc -l | tr -d ' ')"
echo "   Root files: $(find docs -maxdepth 1 -name "*.html" | wc -l | tr -d ' ')"
echo ""
echo "🎉 Docs folder is now properly organized!" 