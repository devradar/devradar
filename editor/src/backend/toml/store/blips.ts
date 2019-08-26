import axios from 'axios'
import { ActionTree } from 'vuex'
import TOML from '@iarna/toml'
import { cleanBlip } from '../../../util'
import { RootState, BlipsState } from '@/types/vuex'
import { RadarContent } from '@/types/domain';

const actions = (appConfig): ActionTree<BlipsState, RootState> =>  ({
  getBlips ({ commit }): void {
    axios.get(appConfig.backend.blipsUrl)
      .then(res => {
        try {
          const json = TOML.parse(res.data) as unknown
          const obj = json as RadarContent
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
  addBlip (): void {
    console.error('Mutating actions not permitted with static backend, this method should not be reachable')
  },
  updateBlip (): void {
    console.error('Mutating actions not permitted with static backend, this method should not be reachable')
  },
  deleteBlip (): void {
    console.error('Mutating actions not permitted with static backend, this method should not be reachable')
  },
  addChange (): void {
    console.error('Mutating actions not permitted with static backend, this method should not be reachable')
  },
  deleteChange (): void {
    console.error('Mutating actions not permitted with static backend, this method should not be reachable')
  }
})

export default {
  actions
}
