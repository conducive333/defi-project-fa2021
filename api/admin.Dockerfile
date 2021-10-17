# For debugging: docker run -it --rm --entrypoint sh admin-server:1.0.0-alpha
# NODE_ENV should be set from the command line
FROM node:14.17-alpine
ARG env
ENV NODE_ENV ${env}
WORKDIR /api
COPY ./package.json ./
COPY ./dist/apps/admin-server/main.js ./dist/apps/admin-server/main.js
COPY ./dist/apps/admin-server/main.js.map ./dist/apps/admin-server/main.js.map
COPY ./env/${env}/.env.admin ./env/${env}/.env.admin
COPY ./env/${env}/.env.firebase ./env/${env}/.env.firebase
COPY ./env/${env}/.env.flow ./env/${env}/.env.flow
COPY ./env/${env}/.env.misc ./env/${env}/.env.misc
RUN npm install --production
ENTRYPOINT npm run admin:start