import Vue from 'vue'
import Router from 'vue-router'
import Radar from '@/components/Radar.vue'
import Home from '@/components/Home.vue'
import ErrorPage from '@/components/ErrorPage.vue'
import Logout from '@/components/Logout.vue'
import Users from '@/components/Users.vue'
import AuthGuard from './auth-guard'
import appConfig from '@/config'

Vue.use(Router)
const routesCfg = appConfig.routes
const components = {
  home: Home,
  logout: Logout,
  users: Users,
  radar: Radar,
  error: ErrorPage
}
const routes = routesCfg
  .map(r => ({
    path: r.path,
    name: r.name,
    component: components[r.name],
    props: r.props || true,
    beforeEnter: AuthGuard(r.validator)
  }))

export default new Router({
  routes,
  // mode: 'history',
  scrollBehavior () {
    return { x: 0, y: 0 }
  }
})
