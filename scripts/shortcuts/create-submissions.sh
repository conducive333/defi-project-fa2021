#!/usr/bin/env bash

# $1 = drawing pool ID
if [ "$#" -ne 1 ]; then
  printf "\nIllegal number of parameters. Expected one argument (the drawing pool ID).\n\n"
  exit 1
fi

# Get image link from Firebase console
FID='5fcdb773-1471-40a7-96a4-2cf6851cd7cb'
URL='https://firebasestorage.googleapis.com/v0/b/crypto-create.appspot.com/o/doge.jpg?alt=media&token=be0385e1-9260-4f2d-9804-cc1748a163aa'

# Get SQL statement
SQL="
  INSERT INTO \"uploaded_file\" (
    \"id\",
    \"key\",
    \"name\",
    \"url\",
    \"mimetype\",
    \"category\",
    \"size\"
  ) VALUES (
    \'$FID\',
    CONCAT(\'doge-\', uuid_generate_v4()),
    \'doge-nft\',
    \'$URL\',
    \'application/octet-stream\',
    \'IMAGE\',
    18048
  ) ON CONFLICT (\"id\") DO NOTHING;
  INSERT INTO \"nft_submission\" (
    \"name\", 
    \"description\",
    \"file_id\", 
    \"address\", 
    \"drawing_pool_id\",
    \"creator_id\"
  ) SELECT
    CONCAT(\'name-\', uuid_generate_v4()) AS \"name\",
    CONCAT(\'description-\', uuid_generate_v4()) AS \"description\",
    \'$FID\' AS \"file_id\",
    \'0x0000000000000000\' AS \"address\",
    \'$1\' AS \"drawing_pool_id\",
    \"user_id\" AS \"creator_id\"
  FROM \"user_to_drawing_pool\" WHERE \"drawing_pool_id\" = \'$1\';
"

# Navigate to the correct directory and run the query
cd "$(dirname "$0")" && \
cd .. && \
cd .. && \
cd api && \
npm run query:dev "$(echo $SQL)"
