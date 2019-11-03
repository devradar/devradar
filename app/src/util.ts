import uuidv4 from 'uuid/v4'
import { Blip } from '@/types/domain'

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
function cleanBlip (blip: Blip) {
  const changes = blip.changes.map(c => {
    const { date, newLevel, text, id } = c
    return { date, newLevel, text, id }
  })
  let level = blip.level
  if (changes.length) {
    level = changes.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0].newLevel
  }
  const { category, link, description, title, id } = blip
  return { category, link, description, title, changes, level, id }
}
export {
  getHash,
  getPseudoRand,
  getUUID,
  cleanBlip
}
