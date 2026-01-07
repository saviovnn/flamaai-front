import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  const isAuthenticated = ref(false)

  const checkAuth = () => {
    const token = localStorage.getItem('token')
    isAuthenticated.value = !!token
    return !!token
  }

  checkAuth()

  const setupStorageWatcher = () => {
    window.addEventListener('storage', (e) => {
      if (e.key === 'token') {
        checkAuth()
      }
    })

    window.addEventListener('localStorageChange', (e) => {
      if (e.detail?.key === 'token') {
        checkAuth()
      }
    })
  }

  const dispatchStorageEvent = (key, newValue) => {
    window.dispatchEvent(
      new CustomEvent('localStorageChange', {
        detail: { key, newValue },
      })
    )
  }

  setupStorageWatcher()

  const logout = async () => {
    try {
      const { authService } = await import('@/api/services')
      await authService.logout()
    } catch (error) {
      console.warn('Erro ao fazer logout no backend:', error)
    }
    
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    dispatchStorageEvent('token', null)
    dispatchStorageEvent('user', null)
    isAuthenticated.value = false
    
    // Limpa os dados do usuário no store global
    const { useGlobalStore } = await import('@/stores/global')
    const globalStore = useGlobalStore()
    globalStore.clearUser()
  }

  const setToken = (token) => {
    if (token) {
      localStorage.setItem('token', token)
      dispatchStorageEvent('token', token)
      isAuthenticated.value = true
    } else {
      logout()
    }
  }

  const setUser = (userData) => {
    if (userData) {
      // Garante que o id está presente
      const userToSave = {
        id: userData.id || null,
        name: userData.name || null,
        email: userData.email || null
      }
      localStorage.setItem('user', JSON.stringify(userToSave))
      dispatchStorageEvent('user', userToSave)
    } else {
      localStorage.removeItem('user')
      dispatchStorageEvent('user', null)
    }
  }

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
  
  // Code Verification actions
  const codeVerificationSubmit = ref(false)
  const codeVerificationResend = ref(false)
  const codeVerificationClearError = ref(false)
  
  const triggerCodeVerificationSubmit = () => {
    codeVerificationSubmit.value = !codeVerificationSubmit.value
  }
  
  const triggerCodeVerificationResend = () => {
    codeVerificationResend.value = !codeVerificationResend.value
  }
  
  const triggerCodeVerificationClearError = () => {
    codeVerificationClearError.value = !codeVerificationClearError.value
  }
  
  // Forgot Password Email actions
  const forgotPasswordEmailSubmit = ref(false)
  const forgotPasswordEmailBack = ref(false)
  const forgotPasswordEmailClearError = ref(false)
  
  const triggerForgotPasswordEmailSubmit = () => {
    forgotPasswordEmailSubmit.value = !forgotPasswordEmailSubmit.value
  }
  
  const triggerForgotPasswordEmailBack = () => {
    forgotPasswordEmailBack.value = !forgotPasswordEmailBack.value
  }
  
  const triggerForgotPasswordEmailClearError = () => {
    forgotPasswordEmailClearError.value = !forgotPasswordEmailClearError.value
  }
  
  // Reset Password actions
  const resetPasswordSubmit = ref(false)
  const resetPasswordCancel = ref(false)
  const resetPasswordClearError = ref(null)
  const resetPasswordConfirmPassword = ref('')
  
  const triggerResetPasswordSubmit = () => {
    resetPasswordSubmit.value = !resetPasswordSubmit.value
  }
  
  const triggerResetPasswordCancel = () => {
    resetPasswordCancel.value = !resetPasswordCancel.value
  }
  
  const triggerResetPasswordClearError = (field) => {
    resetPasswordClearError.value = field
  }
  
  const setResetPasswordConfirmPassword = (value) => {
    resetPasswordConfirmPassword.value = value
  }
  
  return {
    isAuthenticated,
    checkAuth,
    logout,
    setToken,
    setUser,
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
    resetRegister,
    // Code Verification
    codeVerificationSubmit,
    codeVerificationResend,
    codeVerificationClearError,
    triggerCodeVerificationSubmit,
    triggerCodeVerificationResend,
    triggerCodeVerificationClearError,
    // Forgot Password Email
    forgotPasswordEmailSubmit,
    forgotPasswordEmailBack,
    forgotPasswordEmailClearError,
    triggerForgotPasswordEmailSubmit,
    triggerForgotPasswordEmailBack,
    triggerForgotPasswordEmailClearError,
    // Reset Password
    resetPasswordSubmit,
    resetPasswordCancel,
    resetPasswordClearError,
    resetPasswordConfirmPassword,
    triggerResetPasswordSubmit,
    triggerResetPasswordCancel,
    triggerResetPasswordClearError,
    setResetPasswordConfirmPassword
  }
})
