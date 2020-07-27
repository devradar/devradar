import { v4 as uuidv4 } from 'uuid'
import { Blip, BlipChange } from '@/types/domain'

// generate hash from string
function getHash (str: string): number {
  let h = 0
  for (const char of str) {
    h = ((h << 5) - h) + char.charCodeAt(0)
    h |= 0
  }
  return h
}
// create 0..1 pseudo random from string
function getPseudoRand (str: string): number {
  const h = getHash(str)
  // convert signed int32 space to 0..1 float
  return (h + Math.pow(2, 31)) / Math.pow(2, 32)
}

function getUUID () {
  return uuidv4()
}

// return a new object that only contains the pure blip data
function cleanChange (change: BlipChange): BlipChange {
  const { date, newLevel, text, id } = change
  const newChange = { date, newLevel, text, id }
  if (!newChange.id) delete newChange.id
  return newChange
}
function cleanBlip (blip: Blip): Blip {
  let changes = []
  if (blip.changes) {
    changes = blip.changes.map(cleanChange)
  }
  const { category, link, description, title, id } = blip
  const newBlip = { category, link, description, title, changes, id }
  if (!link) newBlip.link = ''
  else if (!/^https?:\/\//i.test(link)) newBlip.link = 'https://' + link
  if (!description) newBlip.description = ''
  if (!id) newBlip.id = getUUID()
  return newBlip
}
function addBlipLevelFromChanges (blip: Blip): Blip {
  let level = blip.level
  if (blip.changes.length) {
    level = blip.changes.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0].newLevel
  }
  blip.level = level
  return blip
}

export {
  getHash,
  getPseudoRand,
  getUUID,
  cleanBlip,
  cleanChange,
  addBlipLevelFromChanges
}
