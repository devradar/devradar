#!/usr/bin/env node
const admin = require('firebase-admin')
const fs = require('fs')
const path = require('path')

const FIREBASE_FILE = '../../firebase-adminsdk.json'

if (!fs.existsSync(path.join(__dirname, FIREBASE_FILE))) {
  console.warn('Firebase Account not found: ', FIREBASE_FILE)
  process.exit(0)
}
const serviceAccount = require(FIREBASE_FILE)

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://devradar-e2e.firebaseio.com'
})

async function purgeCollection (colRef) {
  const docRefs = await admin.firestore().collection(colRef).listDocuments()
  await docRefs.map(ref => ref.delete())
  console.log(`Removed ${docRefs.length} (all) documents for collection '${colRef}'`)
}
async function purgeAll () {
  const collections = await admin.firestore().listCollections()
  collections.forEach(async collectionRef => {
    const id = collectionRef.id
    if (id === 'radars') {
      const radars = await admin.firestore().collection(id).listDocuments()
      await radars.map(ref => purgeCollection(`/radars/${ref.id}/blips`))
    }
    await purgeCollection(collectionRef.id)
  })
}

purgeAll()
