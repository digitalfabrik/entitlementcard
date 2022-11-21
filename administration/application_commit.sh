#!/bin/bash

# This script determines the last commit of the folder administration/src/application.
# This is used as a version for the application form. The form should reset whenever there are changes to the source
# code of the application form.

basedir=$(dirname "$0")
commit=$(git log -n 1 --format="%h" -- "${basedir}/src/application")
if [ -z "$commit" ]
then
  >&2 echo "Could not determine last application commit!"
  exit 1
else
  echo "$commit"
fi
