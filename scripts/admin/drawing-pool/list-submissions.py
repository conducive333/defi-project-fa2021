import requests
import json
import sys

BASE_URL = 'http://localhost:3002/v1'
LIMIT = 10
OFFSET = 0
ORDER = 'DESC'

if __name__ == "__main__":
  print()
  if len(sys.argv) <= 1: raise Exception('Expected first argument to be a UUID')
  res = json.loads(requests.get(f"{BASE_URL}/drawing-pool/{sys.argv[1]}/submissions?limit={LIMIT}&offset={OFFSET}&order={ORDER}").text)
  print(json.dumps(res, indent=2))
  print()