#!/usr/bin/env bash

# https://stackoverflow.com/questions/821396/aborting-a-shell-script-if-any-command-returns-a-non-zero-value
set -e

# $1 = name of the resource
# $2 = if specified, do a dry run
cd "$(dirname "$0")"
if [[ $# -eq 2 ]]
then
  npx nx g @nrwl/workspace:remove $1 --dry-run
elif [[ $# -eq 1 ]]
then
  npx nx g @nrwl/workspace:remove $1
else
  printf "\nInvalid number of arguments.\n"
fi
