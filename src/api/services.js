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

export const geocodingService = {
  async search(query) {
    try {
      const response = await api.post('/geocoding/search', {
        query: query,
      })
      return response.data
    } catch (error) {
      throw error
    }
  }
}

export const weatherService = {
  async getByCoordinates(lat, lng, type = 'all') {
    try {
      const response = await api.post('/weather/by-coordinates', {
        lat: lat,
        lng: lng,
        type: type,
      })
      return response.data
    } catch (error) {
      throw error
    }
  }
}

