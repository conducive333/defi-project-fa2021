import subprocess
import datetime
import requests
import json
import os

### EDIT ZONE ###

# Controls the number of users to create in 
# the database.
NUM_USERS = 10

# Controls how long the drawing pool will be 
# open for (in minutes).
POOL_DURATION = 10

# Controls the number of users to add to the
# drawing pool.
POOL_SIZE = 10

#################

BASE_URL = 'http://localhost:3002/v1'
IMG_NAME = 'drawing-pool-image.png'
CURR_DIR = os.path.dirname(os.path.realpath(__file__))
ASSETS = os.path.join(CURR_DIR, 'assets')

os.chdir(CURR_DIR)

if __name__ == "__main__":
  print()
  subprocess.check_call(["bash", os.path.join(CURR_DIR, "create-users.sh"), f"{NUM_USERS}"], shell=True)
  now = datetime.datetime.utcnow()
  res = json.loads(requests.post(f"{BASE_URL}/drawing-pool/random/image", {
    "name": "An Exciting Drawing Pool!",
    "description": "Enter for a chance to have your artwork tokenized!",
    "releaseDate": now.isoformat(),
    "endDate": (now + datetime.timedelta(minutes=POOL_DURATION)).isoformat(),
    "size": POOL_SIZE
  }, files={
    'file': open(os.path.join(ASSETS, IMG_NAME), 'rb')
  }).text)
  subprocess.check_call(["bash", os.path.join(CURR_DIR, "create-submissions.sh"), res['id']], shell=True)
  print("\n" + json.dumps(res, indent=2))
  print()