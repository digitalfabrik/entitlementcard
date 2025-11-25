#!/bin/bash

# This script determines the last commit of the folder administration/src/routes/applications
# This is used as a version for the application form. The form should reset whenever there are changes to the source
# code of the application form.

if ! command -v git &> /dev/null
then
  >&2 echo "Git is not installed."
  exit 1
fi

basedir=$(dirname "$0")
application_src_dir="${basedir}/src/routes/applications"

if [ ! -d "${application_src_dir}" ]
then
  >&2 echo "The application source directory could not be found: ${application_src_dir}"
  exit 1
fi

commit=$(git log -n 1 --format="%h" -- "${application_src_dir}")
if [ -z "${commit}" ]
then
  >&2 echo "Could not determine last application commit!"
  exit 1
else
  echo "${commit}"
fi
