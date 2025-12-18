import { useAuthStore } from '@/stores/auth'

export const requireAuth = (to, from, next) => {
  const authStore = useAuthStore()
  
  authStore.checkAuth()
  
  if (authStore.isAuthenticated) {
    next()
  } else {
    next('/login')
  }
}

export const requireGuest = (to, from, next) => {
  const authStore = useAuthStore()
  
  authStore.checkAuth()
  
  if (!authStore.isAuthenticated) {
    next()
  } else {
    next('/dashboard')
  }
}

