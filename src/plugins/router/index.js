import Vue    from 'vue'
import Router from 'vue-router'
import routes from './routes'

Vue.use(Router)

const router = new Router({
  mode: `history`,
  routes
})

router.beforeEach((to, from, next) =>
  to.meta.middleware ? to.meta.middleware({ next, router }) : next())

export default router
