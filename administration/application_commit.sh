#!/bin/bash

basedir=$(dirname "$0")
commit=$(git log -n 1 --format="%h" -- "${basedir}/src/applicastion")
if [ -z "$commit" ]
then
  >&2 echo "Could not determine last application commit!"
  exit 1
else
  echo "$commit"
fi
