#!/bin/bash

# Usage: ./render-lecture.sh lecture7
# This will render only the specified lecture

if [ -z "$1" ]; then
    echo "Usage: ./render-lecture.sh <lecture-name>"
    echo "Example: ./render-lecture.sh lecture7"
    exit 1
fi

LECTURE=$1
FILE_PATH="files/lecture_notes/${LECTURE}/${LECTURE}.qmd"

if [ -f "$FILE_PATH" ]; then
    echo "Rendering ${LECTURE}..."
    quarto render "$FILE_PATH"
    echo "✅ ${LECTURE} rendered successfully!"
else
    echo "❌ File not found: $FILE_PATH"
    echo "Available lectures:"
    ls files/lecture_notes/ | grep -E "^lecture[0-9]+$"
fi 