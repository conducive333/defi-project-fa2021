import requests
import json
import sys

BASE_URL = 'http://localhost:3002/v1'

if __name__ == "__main__":
  print()
  if len(sys.argv) <= 2: raise Exception('Expected first argument to be the drawing pool UUID and the second argument to be a user UUID')
  res = json.loads(requests.delete(f"{BASE_URL}/drawing-pool/{sys.argv[1]}/users/{sys.argv[2]}").text)
  print(json.dumps(res, indent=2))
  print()