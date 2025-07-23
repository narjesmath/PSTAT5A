#!/bin/bash

# Usage: ./render-lab.sh lab1
# This will render only the specified lab

if [ -z "$1" ]; then
    echo "Usage: ./render-lab.sh <lab-name>"
    echo "Example: ./render-lab.sh lab1"
    exit 1
fi

LAB=$1
FILE_PATH="files/labs/${LAB}/${LAB}.qmd"

if [ -f "$FILE_PATH" ]; then
    echo "Rendering ${LAB}..."
    quarto render "$FILE_PATH"
    echo "✅ ${LAB} rendered successfully!"
else
    echo "❌ File not found: $FILE_PATH"
    echo "Available labs:"
    ls files/labs/ | grep -E "^lab[0-9]+$"
fi 