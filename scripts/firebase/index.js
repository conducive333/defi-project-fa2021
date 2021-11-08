const firebaseApp = require('firebase/app')
const storage = require('firebase/storage')
const path =require('path')
const fs = require('fs')

require('dotenv').config({
  path: path.join(
    '..', 
    '..', 
    'api', 
    'env', 
    'development', 
    '.env.firebase'
  )
})

async function main() {
  
  // Get file info
  const filename = process.argv[2]
  const buffer = fs.readFileSync(path.join(__dirname, 'assets', filename))

  // Setup app
  const app = firebaseApp.initializeApp({
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_MSG_SENDER_ID,
    appId: process.env.FIREBASE_APP_ID,
    measurementId: process.env.FIREBASE_MEASUREMENT_ID,
  })

  // Upload!
  const ref = storage.ref(storage.getStorage(app), filename)
  const res = await storage.uploadBytes(ref, buffer)
  const url = await storage.getDownloadURL(ref)
  // console.log()
  // console.log("Upload result:", JSON.stringify(res, null, 2))
  console.log()
  console.log("URL:", url)

}

main()
  .then(() => process.exit(0))
  .catch(err => console.log(JSON.stringify(err, null, 2)))