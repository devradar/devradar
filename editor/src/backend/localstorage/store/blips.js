import lzs from 'lz-string'
import { getUUID, cleanBlip } from '../../../util'

const actions = {
  getBlips ({ commit }) {
    let r = decodeURI(window.location).split('?')
    if (r.length < 2) return
    r = r[1]
      .split('&')
      .map(p => p.split('='))
      .find(([k, v]) => k === 'load')
    if (!r) return
    try {
      const string = lzs.decompressFromEncodedURIComponent(r[1])
      const obj = JSON.parse(string)
      commit('setBlips', obj.blips)
      commit('setMeta', obj.meta)
    } catch (e) {
      console.error('Error occurred trying to decompress content', e)
    }
  },
  setBlips ({ commit, dispatch }, blips) {
    commit('dropBlips')
    blips
      .map(cleanBlip)
      .forEach(b => dispatch('addBlip', b))
  },
  addBlip ({ commit }, blip) {
    // prepend https if nothing is there
    if (blip.link && !/^https?:\/\//i.test(blip.link)) blip.link = 'https://' + blip.link
    blip.changes = blip.changes
      .map(c => Object.assign(c, { id: getUUID() }))
    blip.id = getUUID()
    commit('addBlip', blip)
  },
  updateBlip ({ commit }, blip) {
    commit('exchangeBlip', blip)
  },
  deleteBlip ({ commit }, blip) {
    commit('removeBlip', blip)
  },
  addChange ({ commit }, { blip, change }) {
    change = Object.assign(change, { id: getUUID() })
    blip.changes.push(change)
    commit('exchangeBlip', blip)
  },
  deleteChange ({ commit }, { blip, change }) {
    blip.changes = blip.changes.filter(c => c.id !== change.id)
    commit('exchangeBlip', blip)
  },
  getMeta ({ commit }) {
  },
  setMeta ({ commit }, meta) {
    commit('setMeta', meta)
  }
}

export default {
  actions
}
