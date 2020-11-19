#!/bin/bash

dart_files=$(git ls-tree --name-only --full-tree -r HEAD | grep '.dart$')
if [ -z "$dart_files" ]; then
  echo "No dart files in repo."
  exit 0
fi

output=$(./frontend/flutter/bin/flutter format --set-exit-if-changed -n $dart_files)
status=$?

if [ $status -eq 0 ]; then
  echo "All Dart files formatted correctly."
  exit 0
else
  echo "$output"
  echo "Fix the format of these files with flutter format before comitting."
  exit 1
fi
