#!/bin/bash

# Usage: ./render-schedule.sh
# This will render only the schedule page

echo "📅 Rendering schedule page..."
quarto render schedule.qmd --to html

if [ $? -eq 0 ]; then
    echo "✅ Schedule rendered successfully!"
    echo "📁 Output: docs/schedule.html"
else
    echo "❌ Schedule rendering failed."
fi 