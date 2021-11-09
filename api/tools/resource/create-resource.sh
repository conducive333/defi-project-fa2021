#!/usr/bin/env bash

# https://stackoverflow.com/questions/821396/aborting-a-shell-script-if-any-command-returns-a-non-zero-value
set -e

# $1 = name of the resource
# $2 = directory to place the resource in
cd "$(dirname "$0")"
if [[ $# -eq 2 ]]
then
  npx nx g @nrwl/workspace:library --name $1 --directory $2
  npx nx generate @nestjs/schematics:resource --name $1 --sourceRoot libs/$2/$1/src/lib --flat true
elif [[ $# -eq 1 ]]
then
  npx nx g @nrwl/workspace:library --name $1
  npx nx generate @nestjs/schematics:resource --name $1 --sourceRoot libs/$1/src/lib --flat true
else
  printf "\nInvalid number of arguments.\n"
fi
