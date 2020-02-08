import { Module, ActionTree, GetterTree, MutationTree } from 'vuex'
import { RootState, IntroState } from '@/types/vuex'
import { LoginState } from '@/types/domain'
import router from '@/router'

const steps = [
  { // 0
    target: '[data-cy="app-nav-login"]',
    content: `Start your <strong>devradar journey</strong> by logging in with your GitHub/Twitter/Google Account.`,
    transition: 'radar-editable'
  },
  {
    target: '[data-cy="blip-new-button"]',
    content: 'Create a new skill entry',
    transition: 'add-blip-open'
  },
  { // 2
    target: '[data-cy="blip-new-title"]',
    content: 'Enter the title of your first skill<br>example: Kubernetes, TDD, C#',
    transition: 'add-blip-title-changed'
  },
  {
    target: '[data-cy="blip-new-category"]',
    content: 'Select the category that best matches your skill.<br><i>These are the quadrants of your devradar.',
    transition: 'add-blip-category-changed',
    params: {
      placement: 'top'
    }
  },
  { // 4
    target: '[data-cy="blip-new-level"]',
    content: 'How good do you rate your current qualification for the provided skill?',
    transition: 'add-blip-level-changed',
    params: {
      placement: 'top'
    }
  },
  {
    target: '[data-cy="blip-new-submit"]',
    content: 'Save your skill after filling out all required attributes. <b>Optional:</b> Fill in the other descriptions for future reference',
    transition: 'add-blip-submit',
    params: {
      placement: 'right'
    }
  },
  { // 6
    target: '#radarchart',
    content: 'All your skills will be arranged on this graph depending on their <b>Level</b> and <b>Category</b>.<br><b>Hover</b> over the blip circle (with the number inside) to see details',
    transition: ''
  },
  {
    target: '[data-cy="app-nav-list"]',
    content: 'Change into <strong>History view</strong> to make changes to existing skills if you level-up',
    transition: 'list-loaded'
  },
  { // 8
    target: '[data-cy=blip]',
    content: 'Your skills are rendered as text cards on this page. Here you can update and edit information to skill entries you previously made',
    transition: ''
  },
  {
    target: '[data-cy=blip-change-button]',
    content: 'Click here to create another <b>History Entry</b> for this skill. This is typically used when your skills improve. Most users review their devradar periodically <i>every 4-8 weeks</i>',
    transition: 'blip-history-open'
  },
  { // 10
    target: '[data-cy=blip-history-date]',
    content: 'Select when the skill changed. This can be in the past if you want to document older changes to your skills',
    transition: 'blip-history-date-changed',
    params: {
      placement: 'left'
    }
  },
  {
    target: '[data-cy=blip-history-level]',
    content: 'Select the <b>Level</b> this skill changed into',
    transition: 'blip-history-level-changed'
  },
  { // 12
    target: '[data-cy=blip-history-reason]',
    content: 'Provide a small description what you did to improve this skill',
    transition: 'blip-history-reason-changed'
  },
  {
    target: '[data-cy=blip-history-submit]',
    content: 'Add this change to this skill entry',
    transition: 'blip-history-submit'
  }
]
let tour // store reference to $tours object
const actions: ActionTree<IntroState, RootState> = {
  setTourObject (_, app): void {
    tour = app['$tours'].intro
  },
  startIntro ({ commit, rootGetters, dispatch }): void {
    commit('setActive', true)
    tour.start()
    console.log('starting tour', rootGetters['user/user'].uid)

    if (rootGetters['user/loginState'] === LoginState.LOGGED_IN) { // move to radar view if already logged in
      const radarIdOrAlias = rootGetters['blips/radarAlias'] || rootGetters['blips/radarId']
      if (radarIdOrAlias) {
        setTimeout(() => router.push({ name: 'radar', params: { radarId: radarIdOrAlias } }), 100)
      } else {
        console.warn('User already logged in but no radarId/Alias available')
      }
    }
  },
  stopIntro ({ commit }): void {
    commit('setActive', false)
    tour.stop()
  },
  next ({ getters, dispatch }): void {
    console.log('nextz')
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
