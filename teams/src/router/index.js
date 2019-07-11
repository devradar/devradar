import Vue from 'vue'
import Router from 'vue-router'
import Radar from '@/components/Radar'
import Stats from '@/components/Stats'
import Spider from '@/components/Spider'
import Settings from '@/components/Settings'
import appConfig from '@/config'

Vue.use(Router)
const routesCfg = appConfig.routes
const components = {
  Stats,
  Spider,
  Radar,
  Settings
}
const routes = routesCfg
  .map(r => ({
    path: r.path,
    name: r.view,
    component: components[r.view],
    props: true
  }))

export default new Router({
  routes,
  scrollBehavior (to, from, savedPosition) {
    return { x: 0, y: 0 }
  }
})
