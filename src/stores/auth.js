import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  const isAuthenticated = ref(false)

  // Forgot password state
  const forgotPassword = ref({
    email: '',
    code: '',
    newPassword: ''
  })
  
  const setForgotPasswordEmail = (email) => {
    forgotPassword.value.email = email
  }
  
  const setForgotPasswordCode = (code) => {
    forgotPassword.value.code = code
  }
  
  const setForgotPasswordNewPassword = (newPassword) => {
    forgotPassword.value.newPassword = newPassword
  }
  
  const resetForgotPassword = () => {
    forgotPassword.value = {
      email: '',
      code: '',
      newPassword: ''
    }
  }

  // Login state
  const login = ref({
    email: '',
    password: ''
  })

  const setLoginEmail = (email) => {
    login.value.email = email
  }

  const setLoginPassword = (password) => {
    login.value.password = password
  }

  const resetLogin = () => {
    login.value = {
      email: '',
      password: ''
    }
  }

  // Register state
  const register = ref({
    email: '',
    name: '',
    password: ''
  })

  const setRegisterEmail = (email) => {
    register.value.email = email
  }

  const setRegisterName = (name) => {
    register.value.name = name
  }

  const setRegisterPassword = (password) => {
    register.value.password = password
  }

  const resetRegister = () => {
    register.value = {
      email: '',
      name: '',
      password: ''
    }
  }
  
  return {
    isAuthenticated,
    forgotPassword,
    setForgotPasswordEmail,
    setForgotPasswordCode,
    setForgotPasswordNewPassword,
    resetForgotPassword,
    login,
    setLoginEmail,
    setLoginPassword,
    resetLogin,
    register,
    setRegisterEmail,
    setRegisterName,
    setRegisterPassword,
    resetRegister
  }
})
