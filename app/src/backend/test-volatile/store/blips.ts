import { ActionTree } from 'vuex'
import { getUUID, cleanChange, cleanBlip } from '../../../util'
import { Blip, BlipChange, Meta } from '@/types/domain'
import { RootState, BlipsState } from '@/types/vuex'
import router from '@/router'
import radarAliases from '../mock-data/radarAliases'
import radars from '../mock-data/radars'

const actions = (): ActionTree<BlipsState, RootState> => ({
  // return the devradar ID for a given alias (also returns ID if input is already a valid ID)
  async followRadarAlias (_context, alias: string): Promise<string> {
    if (radars[alias]) {
      return alias
    }
    if (radarAliases[alias]) {
      return radarAliases[alias]
    }
  },
  async getRadar ({ commit }, id: string): Promise<void> {
    commit('setLoading', true)
    const response = radars[id]
    if (response) {
      commit('setMeta', response.meta)
      commit('setIsPublic', response.meta.isPublic)
      commit('setId', id)
      commit('setOwnerId', response.meta.owner)
    }

    // populate with blip info
    commit('dropBlips')
    response.blips.forEach(b => {
      // @ts-ignore type checking of docs property
      const blip = cleanBlip(b)
      blip.id = getUUID()
      commit('addBlip', blip)
    })
    commit('setLoading', false)
  },
  // call getRadar if the id is different from the one currently in state
  async getRadarLazy ({ dispatch, rootGetters }, aliasOrId: string): Promise<void> {
    const loadedId = rootGetters['blips/radarId']
    const radarId = await dispatch('followRadarAlias', aliasOrId)
    if (loadedId !== radarId) {
      dispatch('getRadar', radarId)
    }
  },
  async addBlip ({ commit }, blip: Blip): Promise<void> {
    commit('setLoading', true)
    const { title, category, level } = blip
    let { link, changes } = blip
    link = blip.link || ''
    if (link && !/^https?:\/\//i.test(link)) link = 'https://' + link
    // assign IDs to changes
    changes = changes
      .map(c => {
        if (!c.id) c.id = getUUID()
        return c
      })
      .map(cleanChange)
    const newBlip = {
      title,
      category,
      link,
      level,
      changes
    }
    newBlip['id'] = getUUID()
    commit('addBlip', newBlip)
    commit('setLoading', false)
  },
  async updateBlip ({ commit }, blip: Blip): Promise<void> {
    commit('setLoading', true)
    // create copy of the store object to remove changes array/index for firebase entry
    blip.description = blip.description || ''
    blip.link = blip.link || ''
    // prepend https if nothing is there
    if (blip.link && !/^https?:\/\//i.test(blip.link)) blip.link = 'https://' + blip.link
    commit('exchangeBlip', blip)
    commit('setLoading', false)
  },
  async deleteBlip ({ commit }, blip: Blip): Promise<void> {
    commit('setLoading', true)
    commit('removeBlip', blip)
    commit('setLoading', false)
  },
  async setBlips ({ commit }, blips: Blip[]): Promise<void> {
    commit('setLoading', true)
    commit('dropBlips')
    // add all new blips
    blips.forEach(b => {
      commit('addBlip', b)
    })
    commit('setLoading', false)
  },
  async addChange ({ commit }, { blip, change }: { blip: Blip; change: BlipChange }): Promise<void> {
    commit('setLoading', true)
    if (!blip.changes) blip.changes = []
    const newChange = cleanChange(change)
    newChange.id = getUUID()
    blip.changes.push(newChange)
    if (blip.level) blip.level = newChange.newLevel
    commit('exchangeBlip', blip)
    commit('setLoading', false)
  },
  async deleteChange ({ commit }, { blip, change }: { blip: Blip; change: BlipChange }): Promise<void> {
    commit('setLoading', true)
    blip.changes = blip.changes.filter(c => c.id !== change.id)
    commit('exchangeBlip', blip)
    commit('setLoading', false)
  },
  async setMeta ({ commit }, meta: Meta): Promise<void> {
    commit('setLoading', true)
    commit('setMeta', meta)
    commit('setLoading', false)
  },
  async getRadarAlias ({ commit }): Promise<void> {
    commit('setRadarAlias', '')
  },
  async setRadarAlias ({ commit }, { alias, radarId }: { alias: string; radarId: string }): Promise<void> {
    const doc = {
      alias,
      radarId
    }
    commit('setRadarAlias', alias)
    router.push({ name: 'radar', params: { radarId: alias } })
  },
  async isRadarAliasAvailable (_context, alias: string): Promise<boolean> {
    if (radarAliases[alias]) {
      return false
    }
    return true
  }
})

export default {
  actions
}
