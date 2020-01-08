#!/usr/bin/env node
const admin = require('firebase-admin')
const serviceAccount = require('../../firebase-adminsdk.json')

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://devradar-e2e.firebaseio.com'
})

async function purgeCollection(colRef) {
  const docRefs = await admin.firestore().collection(colRef).listDocuments()
  await docRefs.map(ref => ref.delete())
  console.log(`Removed ${docRefs.length} (all) documents for collection '${colRef}'`)
}
async function purgeAll() {
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
