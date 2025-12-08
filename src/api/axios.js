import axios from 'axios'

// Crie uma instância do axios com configurações padrão
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Interceptor de requisição
api.interceptors.request.use(
  (config) => {
    // Adicionar token de autenticação se existir
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

// Interceptor de resposta
api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    // Tratamento de erros global
    if (error.response) {
      // Erro de resposta do servidor
      switch (error.response.status) {
        case 401:
          // Não autorizado - redirecionar para login
          localStorage.removeItem('token')
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
      // Requisição foi feita mas não houve resposta
      console.error('Sem resposta do servidor')
    } else {
      // Erro ao configurar a requisição
      console.error('Erro ao fazer requisição:', error.message)
    }
    return Promise.reject(error)
  }
)

export default api

