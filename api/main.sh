#!/usr/bin/env bash

# TODO: Dockerize this
cd "$(dirname "$0")" && \
npm run build && \
bash ./tools/db/stop.sh && \
bash ./tools/db/start.sh && \
npm run migrate:dev && \
npm run migrate:test && \
npm run start
