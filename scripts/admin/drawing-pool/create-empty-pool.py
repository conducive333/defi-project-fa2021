import datetime
import requests
import json
import sys
import os

BASE_URL = 'http://localhost:3002/v1'
VID_NAME = 'drawing-pool-image.mp4'
IMG_NAME = 'drawing-pool-image.png'
ASSETS = os.path.join(os.path.dirname(os.path.realpath(__file__)), 'assets')

if __name__ == "__main__":
  print()
  
  # if len(sys.argv) <= 1:
  #   raise Exception('Expected at least one argument')
  
  # if sys.argv[1] != 'image' and sys.argv[1] != 'video':
  #   raise Exception('Expected first argument to be either `image` or `video`')
  
  now = datetime.datetime.utcnow() + datetime.timedelta(minutes=1)
  # res = json.loads(requests.post(f"{BASE_URL}/drawing-pool/{sys.argv[1]}", {
  res = json.loads(requests.post(f"{BASE_URL}/drawing-pool/image", {
    "name": "An Exciting Drawing Pool!",
    "description": "Enter for a chance to have your artwork tokenized!",
    "releaseDate": now.isoformat(),
    "endDate": (now + datetime.timedelta(minutes=10)).isoformat(),
  }, files={
    # 'file': open(os.path.join(ASSETS, IMG_NAME if sys.argv[1] == 'image' else VID_NAME), 'rb')
    'file': open(os.path.join(ASSETS, IMG_NAME), 'rb')
  }).text)
  
  print(json.dumps(res, indent=2))
  print()