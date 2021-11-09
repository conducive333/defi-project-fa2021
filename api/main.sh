#!/usr/bin/env bash

# https://stackoverflow.com/questions/821396/aborting-a-shell-script-if-any-command-returns-a-non-zero-value
set -e

# TODO: Dockerize this
cd "$(dirname "$0")"
npm run build
bash ./tools/db/stop.sh
bash ./tools/db/start.sh
sleep 3
npm run migrate:dev
npm run start
