#!/usr/bin/env bash

# $1 = name of the resource
# $2 = directory to place the resource in
cd "$(dirname "$0")" && \
if [[ $# -eq 2 ]]
then
  npx nx g @nrwl/nest:library --name $1 --directory $2 --dry-run && \
  npx nx generate @nestjs/schematics:resource --name $1 --sourceRoot libs/$2/$1/src/lib --flat true --dry-run
elif [[ $# -eq 1 ]]
then
  npx nx g @nrwl/nest:library --name $1 --dry-run && \
  rm ../../libs/$2/$1/src/lib/$1.module.ts
  npx nx generate @nestjs/schematics:resource --name $1 --sourceRoot libs/$1/src/lib --flat true --dry-run
else
  printf "\nInvalid number of arguments.\n"
fi
