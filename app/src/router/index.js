import { createRouter, createWebHashHistory } from 'vue-router'
import AppHome from '../components/AppHome.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: AppHome
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router