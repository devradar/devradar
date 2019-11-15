import Vue from 'vue'
import Router from 'vue-router'
import Radar3 from '@/components/Radar3.vue'
import List from '@/components/List.vue'
import Login from '@/components/Login.vue'
import Logout from '@/components/Logout.vue'
import Users from '@/components/Users.vue'
import Settings from '@/components/Settings.vue'
import AuthGuard from './auth-guard'
import appConfig from '@/config'

Vue.use(Router)
const routesCfg = appConfig.routes
const components = {
  list: List,
  login: Login,
  logout: Logout,
  users: Users,
  settings: Settings,
  radar: Radar3
}
const routes = routesCfg
  .map(r => ({
    path: r.path,
    name: r.name,
    component: components[r.name],
    props: true,
    beforeEnter: AuthGuard(r.validator)
  }))

export default new Router({
  routes,
  // mode: 'history',
  scrollBehavior () {
    return { x: 0, y: 0 }
  }
})
