#!/bin/sh

# A dummy command forwarder for use with mise.
#
# Unless this project is fully converted to use mise, there are some scripts that expect fvm to be installed.
# For mise activated shells, or in CI, this script will forward the command to the real flutter tool, otherwise
# it will call fvm.
#
# Scripts that currently need forwarding:
# - android/Fastfile
# - android/app/build.gradle.kts
# - ios/Fastfile
#
# This script can be removed, when the project is fully embracing mise

if [ -n "$CI" ] || [ -n "$MISE_SHELL" ]; then
  echo "mise fvm forwarder: skipping fvm and forward to mise installed tool..."
  exec mise exec -- "$@"
else
  echo "mise fvm forwarder: use installed fvm"
  exec fvm "$@"
fi
