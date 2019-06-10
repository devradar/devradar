import Vue from 'vue'
import Router from 'vue-router'
import Radar from '@/components/Radar'
import List from '@/components/List'
import Login from '@/components/Login'
import Logout from '@/components/Logout'
import Users from '@/components/Users'
import Settings from '@/components/Settings'
import AuthGuard from './auth-guard'
import appConfig from '@/config'

Vue.use(Router)
const routesCfg = appConfig.routes
const components = {
  Radar,
  List,
  Login,
  Logout,
  Users,
  Settings
}
const routes = routesCfg
  .map(r => ({
    path: r.path,
    name: r.view,
    component: components[r.view],
    props: true,
    beforeEnter: AuthGuard(r.validator)
  }))

export default new Router({
  routes,
  scrollBehavior (to, from, savedPosition) {
    return { x: 0, y: 0 }
  }
})
