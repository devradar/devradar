import Settings from '@/components/Settings.vue'
import Spider from '@/components/Spider.vue'
import Stats from '@/components/Stats.vue'
import appConfig from '@/config'
import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)
const routesCfg = appConfig.routes
const components = {
  Stats,
  Spider,
  Settings
}
const routes = routesCfg
  .map((r) => ({
    path: r.path,
    name: r.view,
    component: components[r.view],
    props: true
  }))

export default new Router({
  routes,
  scrollBehavior () {
    return { x: 0, y: 0 }
  }
})
