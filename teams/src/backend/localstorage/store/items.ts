import { ActionTree } from 'vuex'
import { Item } from '@/types/domain'
import { RootState, ItemsState } from '@/types/vuex'
import dummy from './dummydata'

const actions: ActionTree<ItemsState, RootState> = {
  uploadTeam ({ commit }, payload: Item): void {
    commit('setTeam', payload)
  },
  uploadDev ({ commit }, { item, index }: { item: Item; index: number }): void {
    if (index >= -1) {
      commit('deleteDev', index)
    }
    commit('addDev', item)
  },
  deleteDev ({ commit }, ix: number): void {
    commit('deleteDev', ix)
  },
  loadDummyData ({ commit, dispatch }): void {
    commit('setTeam', dummy.items.team)
    dummy.items.team.payload.blips.forEach((blip): Promise<void> => dispatch('settings/selectBlip', blip, { root: true }))
    dummy.items.devs.forEach((i): void => commit('addDev', i))
  }
}

export default {
  actions
}