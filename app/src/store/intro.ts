import Vue from 'vue'
import { Module, ActionTree, GetterTree, MutationTree } from 'vuex'
import { RootState, IntroState } from '@/types/vuex'

const steps = [
  {
    target: '[data-cy="app-nav-static-login"]',
    content: `Start your <strong>devradar journey</strong>!`,
    transition: 'radar-loaded'
  },
  {
    target: '[data-cy="blip-new-button"]',
    content: 'Create a new skill entry',
    transition: 'add-blip-open'
  },
  {
    target: '[data-v-step="2"]',
    content: 'Try it, you\'ll love it!<br>You can put HTML in the steps and completely customize the DOM to suit your needs.',
    params: {
      placement: 'top'
    }
  }
]
let tour // store reference to $tours object
const actions: ActionTree<IntroState, RootState> = {
  setTourObject (_, app): void {
    console.log('vuex setting tour', app, app['$tours'].intro)
    tour = app['$tours'].intro
    console.log('vuex done', tour)
  },
  startIntro ({ commit }): void {
    commit('setActive', true)
    tour = this['_vm'].$tours.intro
    tour.start()
  },
  stopIntro ({ commit }): void {
    commit('setActive', false)
  },
  next (): void {
    this['_vm'].$tours.intro.nextStep()
  },
  // specific events triggered by various components -> intro state machine
  event ({ commit, getters, dispatch }, event): void {
    let requiredTransition
    if (getters.steps && getters.step >= 0) {
      requiredTransition = getters.steps[getters.step].transition
    }
    console.log('Event fired:', event, 'required for next transition:', requiredTransition)
    if (event === requiredTransition) {
      dispatch('next')
    }
  }
}

const mutations: MutationTree<IntroState> = {
  setActive (state, value): void {
    state.isActive = value
  }
}

const getters: GetterTree<IntroState, RootState> = {
  isActive (state) {
    console.log('active', state.isActive, tour.isRunning)
    return state.isActive
  },
  step () {
    return tour.currentStep
  },
  stepCount () {
    return tour.numberOfSteps
  },
  isFirstStep () {
    return tour.currentStep === 0
  },
  isLastStep () {
    return tour.isLast
  },
  steps () {
    return steps
  }
}

const state: IntroState = {
  isActive: false
}

export const intro = (): Module<IntroState, RootState> => {
  return {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
  }
}
