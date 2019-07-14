const uuidv4 = require('uuid/v4')

// generate hash from string
function getHash (string) {
  let h = 0
  for (const char of string) {
    h = ((h << 5) - h) + char.charCodeAt(0)
    h |= 0
  }
  return h
}
// create 0..1 pseudo random from string
function getPseudoRand (string) {
  const h = getHash(string)
  // convert signed int32 space to 0..1 float
  return (h + Math.pow(2, 31)) / Math.pow(2, 32)
}

function getUUID () {
  return uuidv4()
}

// return a new object that only contains the pure blip data
function cleanBlip (blip) {
  const changes = blip.changes.map((c, cIndex) => {
    const { date, newState, text, id } = c
    return { date, newState, text, id }
  })
  const state = changes.sort((a, b) => a.date < b.date)[0].newState
  const { category, link, description, title, id } = blip
  return { category, link, description, title, changes, state, id }
}
export {
  getHash,
  getPseudoRand,
  getUUID,
  cleanBlip
}
