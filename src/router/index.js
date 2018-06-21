import Vue from 'vue'
import Router from 'vue-router'
import Radar from '@/components/Radar'
import History from '@/components/History'
import Deprecated from '@/components/Deprecated'
import Login from '@/components/Login'
import Logout from '@/components/Logout'
import Users from '@/components/Users'

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
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/logout',
      name: 'Logout',
      component: Logout
    },
    {
      path: '/users',
      name: 'Users',
      component: Users
    }
  ]
})
