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
  {
    path: '/termos-de-uso',
    name: 'TermosDeUso',
    component: () => import('@/views/TermosDeUso.vue')
  },
  {
    path: '/politica-de-privacidade',
    name: 'PoliticaPrivacidade',
    component: () => import('@/views/PoliticaPrivacidade.vue')
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router

