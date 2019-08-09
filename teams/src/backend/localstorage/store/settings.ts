import { ActionTree } from 'vuex'
import { Blip } from '@/types/domain'
import { RootState, SettingsState } from '@/types/vuex'

const actions: ActionTree<SettingsState, RootState> = {
  selectBlip ({ commit }, blip: Blip): void {
    commit('selectBlip', blip)
  },
  deselectBlip ({ commit }, blip: Blip): void {
    commit('deselectBlip', blip)
  }
}

export default {
  actions
}
