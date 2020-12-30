# Style and coding conventions

## Frontend

We follow the official [effective dart guides](https://dart.dev/guides/language/effective-dart).

### Commit hook
The pipeline will fail if dart files are not formatted correctly.
It is encouraged to add a pre-commit hook like this:
```sh
 #!/bin/bash

output=$(flutter format --set-exit-if-changed frontend/lib frontend/test)
status=$?

if [ $status -eq 0 ]; then
  echo "All Dart files formatted correctly."
  exit 0
else
  echo "$output"
  echo "Re-attempt commit."
  exit 1
fi
```
Just paste this into the new file `.git/hooks/pre-commit` and make it executable. 
When committing and your files are not formatted correctly, they are fixed if possible and the commit will be aborted so that you can re-check your files.
