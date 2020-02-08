import { Module, ActionTree, GetterTree, MutationTree } from 'vuex'
import { RootState, IntroState } from '@/types/vuex'

const steps = [
  {
    target: '[data-cy="app-nav-static-login"]',
    content: `Start your <strong>devradar journey</strong> by logging in with your GitHub/Twitter/Google Account.`,
    transition: 'radar-editable'
  },
  {
    target: '[data-cy="blip-new-button"]',
    content: 'Create a new skill entry',
    transition: 'add-blip-open'
  },
  {
    target: '[data-cy="blip-new-title"]',
    content: 'Enter your first skill<br>example: Kubernetes, TDD, C#',
    transition: 'add-blip-title-changed',
    params: {
      placement: 'top'
    }
  },
  {
    target: '[data-cy="blip-new-category"]',
    content: 'Select the category that best matches your skill.<br><i>These are the quadrants of your devradar.',
    transition: 'add-blip-category-changed',
    params: {
      placement: 'top'
    }
  },
  {
    target: '[data-cy="blip-new-level"]',
    content: 'How good do you rate your current qualification for the provided skill?',
    transition: 'add-blip-level-changed',
    params: {
      placement: 'top'
    }
  },
  {
    target: '[data-cy="blip-new-submit"]',
    content: 'Save your skill after filling out all required attributes',
    transition: 'add-blip-submit',
    params: {
      placement: 'right'
    }
  }
]
let tour // store reference to $tours object
const actions: ActionTree<IntroState, RootState> = {
  setTourObject (_, app): void {
    tour = app['$tours'].intro
  },
  startIntro ({ commit }): void {
    commit('setActive', true)
    tour.start()
  },
  stopIntro ({ commit }): void {
    commit('setActive', false)
    tour.stop()
  },
  next ({ getters, dispatch }): void {
    if (getters.isLastStep) {
      dispatch('stopIntro')
    } else {
      tour.nextStep()
    }
  },
  // specific events triggered by various components -> intro state machine
  event ({ getters, dispatch }, event): void {
    let requiredTransition
    if (getters.steps && getters.step >= 0) {
      requiredTransition = getters.steps[getters.step].transition
    }
    // console.log('Event fired:', event, 'required for next transition:', requiredTransition)
    if (event === requiredTransition) {
      setTimeout(() => dispatch('next'), 100) // artificial delay to make sure all other vue render processes took place
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
