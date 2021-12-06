import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import store from '../store'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/notas',
    name: 'notas',
    component: () => import(/* webpackChunkName: "about" */ '../views/Notas.vue'),
    // PROTEJER RUTAS
    meta: { requireAuth: true }
  },
  {
    path: '/login',
    name: 'login',
    component: () => import(/* webpackChunkName: "about" */ '../views/Login.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})


router.beforeEach((to, from, next) => {
  const routerProtecter = to.matched.some(record => record.meta.requireAuth);
  // la ruta es protegida y tiene token
  if (routerProtecter && store.state.token === '') {
    next({ name: 'login' })
  } else {
    next()
  }
})

export default router
