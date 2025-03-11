#!/bin/bash

# This script adds .js extensions to all import statements in TypeScript files
# It's needed because ES modules in Node.js require file extensions

# Find all TypeScript files in the server directory
find server -name "*.js" | while read -r file; do
  echo "Processing $file..."
  
  # Add .js extension to local imports
  sed -i '' -E 's/from "\.\.?\/(.*?)"/from "\.\.\/\1.ts"/g' "$file"
  sed -i '' -E 's/from "\.\.?\/(.*?)\/(.*)"/from "\.\.\/\1\/\2.ts"/g' "$file"
  
  # Don't modify imports from node_modules
  # sed -i '' -E 's/from "([^\.][^"]+)"/from "\1"/g' "$file"
done

echo "Done! All import statements have been updated."

