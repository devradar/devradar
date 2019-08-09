import axios from 'axios'
import TOML from '@iarna/toml'
import { cleanBlip } from '../../../util'
import appConfig from '../../../config'

const actions = {
  getBlips ({ commit, dispatch }) {
    axios.get(appConfig.backend.blipsUrl)
      .then(res => {
        try {
          const obj = TOML.parse(res.data)
          commit('setMeta', obj.meta)
          commit('dropBlips')
          obj.blips
            .map(cleanBlip)
            .forEach(b => commit('addBlip', b))
          commit('com/setSnackbar', 'updated local blips + config')
        } catch (e) {
          console.error('Error occurred trying to decompress content', e)
        }
      })
  },
  addBlip ({ commit, dispatch }, blip) {
    console.error('Mutating actions not permitted with static backend, this method should not be reachable')
  },
  updateBlip ({ commit }, blip) {
    console.error('Mutating actions not permitted with static backend, this method should not be reachable')
  },
  deleteBlip ({ commit }, blip) {
    console.error('Mutating actions not permitted with static backend, this method should not be reachable')
  },
  addChange ({ commit }, { blip, change }) {
    console.error('Mutating actions not permitted with static backend, this method should not be reachable')
  },
  deleteChange ({ commit }, { blip, change }) {
    console.error('Mutating actions not permitted with static backend, this method should not be reachable')
  }
}

export default {
  actions
}
