import requests
import json

BASE_URL = 'http://localhost:3002/v1'
LIMIT = 10
OFFSET = 0
ORDER = 'DESC'

if __name__ == "__main__":
  print()
  res = json.loads(requests.get(f"{BASE_URL}/drawing-pool?limit={LIMIT}&offset={OFFSET}&order={ORDER}").text)
  print(json.dumps(res, indent=2))
  print()