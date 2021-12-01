import requests
import json
import sys

BASE_URL = 'http://localhost:3002/v1'

if __name__ == "__main__":
  print()
  if len(sys.argv) <= 1: raise Exception('Expected first argument to be the drawing pool UUID')
  submissions = json.loads(requests.get(f"{BASE_URL}/drawing-pool/{sys.argv[1]}/submissions").text)
  if 'error' not in submissions:
    for sub in submissions:
      print(f"Creating a listing for submission {sub['id']}... ", end='')
      res = json.loads(requests.post(f"{BASE_URL}/listings", {
        "nftSubmissionId": sub['id']
      }).text)
      print("done!")
  else:
    raise Exception(submissions['error'])