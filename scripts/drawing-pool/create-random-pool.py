import requests
import json

BASE_URL = 'http://localhost:3002/v1'

if __name__ == "__main__":
  print()
  res = json.loads(requests.post(f"{BASE_URL}/drawing-pool/random/image", {
    "name": "",
    "description": "",
    "releaseDate": "",
    "endDate": "",
    "size": "",
    "file": open()
  }).text)
  print(json.dumps(res, indent=2))
  print()