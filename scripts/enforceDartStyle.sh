#!/bin/bash

dart_files=$(git ls-tree --name-only -r HEAD | grep '.dart$' | tr '\n' ' ')
if [ -z "$dart_files" ]; then
  echo "No dart files in repo."
  exit 0
fi

# Exclude generated code
dart_files=$(find $dart_files -type f -not -path "*lib/graphql/*")

output=$(flutter format --set-exit-if-changed -n $dart_files)
status=$?

if [ $status -eq 0 ]; then
  echo "All Dart files formatted correctly."
  exit 0
else
  echo "$output"
  echo "Fix the format of these files with flutter format before comitting."
  exit 1
fi
