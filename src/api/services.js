import api from './axios'
export const authService = {
  async login(credentials) {
    try {
      const response = await api.post('/auth/sign-in/email', {
        email: credentials.email,
        password: credentials.password,
      })
      return response.data
    } catch (error) {
      throw error
    }
  },

  async register(userData) {
    try {
      const response = await api.post('/auth/sign-up/email', {
        email: userData.email,
        password: userData.password,
        name: userData.name,
      })
      return response.data
    } catch (error) {
      throw error
    }
  },

  async logout() {
    try {
      const response = await api.post('/auth/sign-out')
      return response.data
    } catch (error) {
      throw error
    }
  },

  async forgotPassword(email) {
    try {
      const response = await api.post('/auth/forgot-password', {
        email: email,
      })
      return response.data
    } catch (error) {
      throw error
    }
  },

  async resetPassword(email, code, newPassword) {
    try {
      const response = await api.post('/auth/reset-password', {
        email: email,
        code: code,
        newPassword: newPassword,
      })
      return response.data
    } catch (error) {
      throw error
    }
  }
}

export const orchestratorService = {
  async search(query, userId, preference = 'weather') {
    try {
      const body = {
        query: String(query).trim(),
        userId: String(userId).trim(),
        preference: preference === 'air' ? 'air' : 'weather',
      }
      
      const response = await api.post('/orchestrator/search', body)
      return response.data
    } catch (error) {
      console.error('Orchestrator service - Erro:', error)
      if (error.response) {
        console.error('Response data:', error.response.data)
      }
      throw error
    }
  },

  async getSingle(locationId) {
    try {
      const body = {
        locationId: String(locationId).trim(),
      }
      
      const response = await api.post('/orchestrator/single', body)
      return response.data
    } catch (error) {
      console.error('Orchestrator service - Erro ao buscar single:', error)
      if (error.response) {
        console.error('Response data:', error.response.data)
      }
      throw error
    }
  }
}

export const getAllSearchHistoryService = async (userId) => {
  try {
    const body = {
      userId: String(userId).trim(),
    }
    const response = await api.post('/orchestrator/all', body)
    
    // A API agora retorna diretamente o array, sem wrapper
    return response.data || []
  } catch (error) {
    console.error('Erro ao buscar histórico de buscas:', error)
    throw error
  }
}