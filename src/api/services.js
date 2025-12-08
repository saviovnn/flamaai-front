import api from './axios'

// Exemplo de serviços de API

export const authService = {
  // Login com email e senha (Better Auth)
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

  // Registro com email e senha (Better Auth)
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

  // Logout (Better Auth)
  async logout() {
    try {
      const response = await api.post('/auth/sign-out')
      return response.data
    } catch (error) {
      throw error
    }
  },

  // Obter sessão atual (Better Auth)
  async getSession() {
    try {
      const response = await api.get('/auth/get-session')
      return response.data
    } catch (error) {
      throw error
    }
  },

  // Login com Google (Better Auth)
  async loginWithGoogle() {
    try {
      const response = await api.post('/auth/sign-in/social', {
        provider: 'google'
      })
      // Redireciona o usuário para a URL do Google OAuth
      if (response.data.url) {
        window.location.href = response.data.url
      }
      return response.data
    } catch (error) {
      throw error
    }
  }
}

export const userService = {
  // Obter perfil do usuário
  async getProfile() {
    try {
      const response = await api.get('/user/profile')
      return response.data
    } catch (error) {
      throw error
    }
  },

  // Atualizar perfil
  async updateProfile(userData) {
    try {
      const response = await api.put('/user/profile', userData)
      return response.data
    } catch (error) {
      throw error
    }
  }
}

// Adicione mais serviços conforme necessário
export const dataService = {
  // Exemplo: buscar lista de items
  async getItems() {
    try {
      const response = await api.get('/items')
      return response.data
    } catch (error) {
      throw error
    }
  },

  // Exemplo: criar item
  async createItem(itemData) {
    try {
      const response = await api.post('/items', itemData)
      return response.data
    } catch (error) {
      throw error
    }
  },

  // Exemplo: atualizar item
  async updateItem(id, itemData) {
    try {
      const response = await api.put(`/items/${id}`, itemData)
      return response.data
    } catch (error) {
      throw error
    }
  },

  // Exemplo: deletar item
  async deleteItem(id) {
    try {
      const response = await api.delete(`/items/${id}`)
      return response.data
    } catch (error) {
      throw error
    }
  }
}

