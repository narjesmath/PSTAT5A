#!/bin/bash

# Usage: ./render-worksheet.sh worksheet1
# This will render only the specified worksheet

if [ -z "$1" ]; then
    echo "Usage: ./render-worksheet.sh <worksheet-name>"
    echo "Example: ./render-worksheet.sh worksheet1"
    exit 1
fi

WORKSHEET=$1
FILE_PATH="files/worksheets/${WORKSHEET}.qmd"

if [ -f "$FILE_PATH" ]; then
    echo "Rendering ${WORKSHEET}..."
    quarto render "$FILE_PATH"
    echo "✅ ${WORKSHEET} rendered successfully!"
else
    echo "❌ File not found: $FILE_PATH"
    echo "Available worksheets:"
    ls files/worksheets/ | grep -E "^worksheet[0-9]+\.qmd$" | sed 's/\.qmd$//'
fi 