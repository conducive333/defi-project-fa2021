import requests
import json
import sys

BASE_URL = 'http://localhost:3002/v1'

if __name__ == "__main__":
  print()
  res = json.loads(requests.post(f"{BASE_URL}/drawing-pool/{sys.argv[1]}", {
    "address": "",
    "name": ""
  }).text)
  print(json.dumps(res, indent=2))
  print()