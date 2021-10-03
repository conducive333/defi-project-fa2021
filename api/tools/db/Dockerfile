FROM postgres:12
RUN apt-get update && apt-get -y install postgresql-12-cron
COPY ./init-test.sh ./docker-entrypoint-initdb.d