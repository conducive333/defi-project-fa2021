import datetime
import requests
import json
import sys
import os

BASE_URL = 'http://localhost:3002/v1'
VID_NAME = 'drawing-pool-image.mp4'
IMG_NAME = 'drawing-pool-image.png'
ASSETS = 'assets'

if __name__ == "__main__":
  print()

  if len(sys.argv) <= 1:
    raise Exception('Expected at least one argument')
  
  if sys.argv[1] != 'image' and sys.argv[1] != 'video':
    raise Exception('Expected first argument to be either `image` or `video`')

  now = datetime.datetime.now()
  res = json.loads(requests.post(f"{BASE_URL}/drawing-pool/random/{sys.argv[1]}", {
    "name": "An Exciting Drawing Pool!",
    "description": "Enter for a chance to have your artwork tokenized!",
    "releaseDate": now,
    "endDate": now + datetime.timedelta(minutes=1),
    "size": 10
  }, files={
    'file': open(os.path.join(ASSETS, IMG_NAME if sys.argv[1] == 'image' else VID_NAME), 'r')
  }).text)

  print(json.dumps(res, indent=2))
  print()