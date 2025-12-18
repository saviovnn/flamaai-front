import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    if (error.response) {
      switch (error.response.status) {
        case 401:
          import('@/stores/auth').then(({ useAuthStore }) => {
            const authStore = useAuthStore()
            authStore.logout()
          }).catch(() => {
            localStorage.removeItem('token')
          })
          window.location.href = '/login'
          break
        case 403:
          console.error('Acesso proibido')
          break
        case 404:
          console.error('Recurso não encontrado')
          break
        case 500:
          console.error('Erro interno do servidor')
          break
        default:
          console.error('Erro na requisição:', error.response.data)
      }
    } else if (error.request) {
      console.error('Sem resposta do servidor')
    } else {
      console.error('Erro ao fazer requisição:', error.message)
    }
    return Promise.reject(error)
  }
)

export default api
