import Vue from 'vue'
import Router from 'vue-router'
import Radar from '@/components/Radar'
import History from '@/components/History'
import Deprecated from '@/components/Deprecated'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Radar',
      component: Radar
    },
    {
      path: '/history',
      name: 'History',
      component: History
    },
    {
      path: '/deprecated',
      name: 'Deprecated',
      component: Deprecated
    }
  ]
})
