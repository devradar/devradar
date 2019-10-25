import lzs from 'lz-string'
import { ActionTree } from 'vuex'
import { getUUID, cleanBlip } from '../../../util'
import { Blip, Meta, BlipChange } from '@/types/domain'
import { RootState, BlipsState } from '@/types/vuex'

// allow migration for files happening before issue#54
function migrateToEnum (blip: Blip, meta: Meta) {
  if (typeof blip.category === 'string' && meta.categories.length) {
    blip.category = meta.categories.indexOf(blip.category)
  }
  if (typeof blip.level === 'string' && meta.levels.length) {
    blip.level = meta.levels.indexOf(blip.level)
  }
  blip.changes = blip.changes
    .map(change => {
      if (typeof change.newLevel === 'string' && meta.levels.length) {
        change.newLevel = meta.levels.indexOf(change.newLevel)
      }
      return change
    })
  return blip
}

const actions = (appConfig): ActionTree<BlipsState, RootState> =>  ({ // eslint-disable-line
  getBlips ({ commit, dispatch }): void {
    let r = decodeURI(window.location.toString()).split('?')
    if (r.length < 2) return
    r = r[1]
      .split('&')
      .map(p => p.split('='))
      .find(([k]) => k === 'load')
    if (!r) return
    try {
      const string = lzs.decompressFromEncodedURIComponent(r[1])
      const obj = JSON.parse(string)
      commit('setMeta', obj.meta)
      dispatch('setBlips', obj.blips)
    } catch (e) {
      console.error('Error occurred trying to decompress content', e)
    }
  },
  setBlips ({ commit, dispatch, getters }, blips: Blip[]): void {
    commit('dropBlips')
    blips
      .map((b: Blip) => migrateToEnum(b, getters.meta))
      .map(cleanBlip)
      .forEach((b: Blip) => dispatch('addBlip', b))
  },
  addBlip ({ commit }, blip: Blip): void {
    // prepend https if nothing is there
    if (blip.link && !/^https?:\/\//i.test(blip.link)) blip.link = 'https://' + blip.link
    commit('addBlip', blip)
  },
  updateBlip ({ commit }, blip: Blip): void {
    commit('exchangeBlip', blip)
  },
  deleteBlip ({ commit }, blip: Blip): void {
    commit('removeBlip', blip)
  },
  addChange ({ commit }, { blip, change }: { blip: Blip; change: BlipChange }): void {
    change = Object.assign(change, { id: getUUID() })
    blip.changes.push(change)
    commit('exchangeBlip', blip)
  },
  deleteChange ({ commit }, { blip, change }: { blip: Blip; change: BlipChange }): void {
    blip.changes = blip.changes.filter(c => c.id !== change.id)
    commit('exchangeBlip', blip)
  },
  setMeta ({ commit }, meta: Meta): void {
    commit('setMeta', meta)
  }
})

export default {
  actions
}
