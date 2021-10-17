# For debugging: docker run -it --rm --entrypoint sh listener:1.0.0-alpha
# NODE_ENV should be set from the command line
FROM node:14.17-alpine
ARG env
ENV NODE_ENV ${env}
ENV EVENT_LISTENER nft
WORKDIR /api
COPY ./package.json ./
COPY ./dist/apps/flow-listener/main.js ./dist/apps/flow-listener/main.js
COPY ./dist/apps/flow-listener/main.js.map ./dist/apps/flow-listener/main.js.map
COPY ./env/${env}/.env.client ./env/${env}/.env.client
COPY ./env/${env}/.env.flow ./env/${env}/.env.flow
RUN npm install --production
ENTRYPOINT npm run listener:start