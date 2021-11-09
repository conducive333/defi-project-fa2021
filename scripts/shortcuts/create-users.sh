#!/usr/bin/env bash

# This script will insert the specified number of fake users
# into the "user" table. It can be run multiple times without
# errors and it will always append more users to the table 
# instead of clearing the table and re-inserting users.

# https://stackoverflow.com/questions/821396/aborting-a-shell-script-if-any-command-returns-a-non-zero-value
set -e

# $1 = number of users to insert into database
if [ "$#" -ne 1 ]; then
  printf "\nIllegal number of parameters. Expected one argument (the number of users to create).\n\n"
  exit 1
fi

# Get SQL statement
SQL="
  INSERT INTO \"user\" (\"id\", \"email\", \"username\") 
  SELECT 
    uuid_generate_v4() AS "id", 
    CONCAT(CONCAT(\'user\', i), \'@mail.com\') AS \"email\", 
    CONCAT(\'user\', i) AS \"username\" 
  FROM
    generate_series(
      (SELECT COUNT(*) FROM \"user\") + 1, 
      (SELECT COUNT(*) FROM \"user\") + $1
    ) AS i;
"

# Navigate to the correct directory and run the query
cd "$(dirname "$0")"
cd ..
cd ..
cd api
npm run query:dev "$(echo $SQL)"
