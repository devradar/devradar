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

export {
  getHash,
  getPseudoRand
}
