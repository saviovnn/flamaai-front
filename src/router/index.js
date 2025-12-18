import { createRouter, createWebHistory } from 'vue-router'
import { requireAuth, requireGuest } from './guards'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/Home.vue')
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Login.vue'),
    beforeEnter: requireGuest
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('@/views/Dashboard.vue'),
    beforeEnter: requireAuth
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router

