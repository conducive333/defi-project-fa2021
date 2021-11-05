#!/usr/bin/env bash

# TODO: Dockerize this
cd "$(dirname "$0")" && \
npm run build && \
bash ./tools/db/stop.sh && \
bash ./tools/db/start.sh && \
sleep 3 && \
npm run migrate:dev && \
npm run start
