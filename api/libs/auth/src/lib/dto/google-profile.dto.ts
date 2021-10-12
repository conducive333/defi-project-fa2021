export interface GoogleProfile {
  id: string
  displayName: string
  name: {
    familyName: string
    givenName: string
  }
  emails: [
    {
      value: string
      verified: boolean
    }
  ]
  photos: [
    {
      value: string
    }
  ]
  provider: string
  _raw: string
  _json: {
    sub: string
    name: string
    given_name: string
    family_name: string
    picture: string
    email: string
    email_verified: boolean
    locale: string
    hd: string
  }
}

// Example:
// {
//   "id": "108336265259803300658",
//   "displayName": "John Doe",
//   "name": {
//     "familyName": "Doe",
//     "givenName": "John"
//   },
//   "emails": [
//     {
//       "value": "john.doe@anchain.ai",
//       "verified": true
//     }
//   ],
//   "photos": [
//     {
//       "value": "https://lh3.googleusercontent.com/a/BATXAJzBrgKYzepHPjEIQX_i19_SQ-UrK8kTphgC60Jc=s96-c"
//     }
//   ],
//   "provider": "google",
//   "_raw": "{\n  \"sub\": \"108336265259803300658\",\n  \"name\": \"Chris Deleon\",\n  \"given_name\": \"Chris\",\n  \"family_name\": \"Deleon\",\n  \"picture\": \"https://lh3.googleusercontent.com/a/AATXAJzBrgKYzepHPjEIQX_i19_SQ-UrK8kTphgC60Jc\\u003ds96-c\",\n  \"email\": \"chris.deleon@anchain.ai\",\n  \"email_verified\": true,\n  \"locale\": \"en\",\n  \"hd\": \"anchain.ai\"\n}",
//   "_json": {
//     "sub": "108336265259803300658",
//     "name": "Chris Deleon",
//     "given_name": "Chris",
//     "family_name": "Deleon",
//     "picture": "https://lh3.googleusercontent.com/a/AATXAJzBrgKYzepHPjEIQX_i19_SQ-UrK8kTphgC60Jc=s96-c",
//     "email": "chris.deleon@anchain.ai",
//     "email_verified": true,
//     "locale": "en",
//     "hd": "anchain.ai"
//   }
// }
