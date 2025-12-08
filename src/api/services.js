import api from './axios'

// Exemplo de serviços de API

export const authService = {
  // Login
  async login(credentials) {
    try {
      const response = await api.post('/auth/login', credentials)
      return response.data
    } catch (error) {
      throw error
    }
  },

  // Registro
  async register(userData) {
    try {
      const response = await api.post('/auth/register', userData)
      return response.data
    } catch (error) {
      throw error
    }
  },

  // Logout
  async logout() {
    try {
      const response = await api.post('/auth/logout')
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

