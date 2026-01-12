import { ref, computed, watch } from 'vue'
import { defineStore } from 'pinia'

export const useGlobalStore = defineStore('global', () => {
  const isSidebarOpen = ref(false)
  const isSettingsOpen = ref(false)
  
  // Theme management
  const theme = ref('system') // 'light' | 'dark' | 'system'
  
  // Computed para verificar o tema efetivo (considerando system)
  const effectiveTheme = computed(() => {
    if (theme.value === 'system') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    }
    return theme.value
  })
  
  const isDark = computed(() => effectiveTheme.value === 'dark')
  
  // Aplica o tema no documento
  const applyTheme = () => {
    const favicon = document.getElementById('favicon')
    
    if (isDark.value) {
      document.documentElement.classList.add('dark')
      if (favicon) favicon.href = '/logo-dark.svg'
    } else {
      document.documentElement.classList.remove('dark')
      if (favicon) favicon.href = '/logo.svg'
    }
  }
  
  // Inicializa o tema (chama no App.vue)
  const initTheme = () => {
    // Recupera o tema salvo no localStorage, ou usa 'system' como padrão
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme && ['light', 'dark', 'system'].includes(savedTheme)) {
      theme.value = savedTheme
    } else {
      theme.value = 'system'
    }
    
    applyTheme()
    
    // Escuta mudanças na preferência do sistema
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
      if (theme.value === 'system') {
        applyTheme()
      }
    })
  }
  
  // Define o tema
  const setTheme = (newTheme) => {
    theme.value = newTheme
    localStorage.setItem('theme', newTheme)
    applyTheme()
  }
  
  // Watch para aplicar o tema quando mudar
  watch(theme, () => {
    applyTheme()
  })
  const searchHistory = ref({})
  const searchHistoryList = ref([]) // Novo formato: array de objetos
  const selectedSearch = ref(null)
  
  const setSearchHistoryList = (historyArray) => {
    searchHistoryList.value = historyArray || []
  }
  
  // Search query
  const searchQuery = ref('')
  
  const setSearchQuery = (query) => {
    searchQuery.value = query
  }
  
  // Preference: 'weather' | 'air' - default é 'weather'
  const preference = ref('weather')
  
  const setPreference = (pref) => {
    if (pref === 'weather' || pref === 'air') {
      preference.value = pref
    }
  }
  
  // Search submit data
  const searchSubmitData = ref({
    query: null,
    climaTempo: false,
    qualidadeAr: false
  })
  
  const setSearchSubmitData = (data) => {
    searchSubmitData.value = {
      query: data?.query || null,
      climaTempo: data?.climaTempo || false,
      qualidadeAr: data?.qualidadeAr || false
    }
  }
  
  // Orchestrator response data (complete response)
  const orchestratorResponse = ref(null)
  
  const setOrchestratorResponse = (data) => {
    orchestratorResponse.value = data
  }
  
  // Loading state for search
  const isSearchLoading = ref(false)
  
  const setSearchLoading = (loading) => {
    isSearchLoading.value = loading
  }
  
  // Dashboard state - true when orchestrator response is available
  const dashboard = ref(false)
  
  const setDashboard = (value) => {
    dashboard.value = value
  }
  
  // Watch para atualizar dashboard quando a resposta do orchestrator estiver disponível
  watch(orchestratorResponse, (response) => {
    if (response) {
      dashboard.value = true
    } else {
      dashboard.value = false
    }
  }, { deep: true })
  
  // Voice recognition
  const isRecording = ref(false)
  const transcribedText = ref('')
  
  const startRecording = () => {
    isRecording.value = true
  }
  
  const stopRecording = () => {
    isRecording.value = false
  }
  
  const setTranscribedText = (text) => {
    transcribedText.value = text
  }
  
  const clearTranscribedText = () => {
    transcribedText.value = ''
  }
  
  // User information
  const user = ref({
    id: null,
    name: null,
    email: null
  })
  
  const setUser = (userData) => {
    if (userData) {
      user.value = {
        id: userData.id || null,
        name: userData.name || null,
        email: userData.email || null
      }
      // Salva no localStorage também
      localStorage.setItem('user', JSON.stringify(user.value))
    }
  }
  
  const clearUser = () => {
    user.value = {
      id: null,
      name: null,
      email: null
    }
    localStorage.removeItem('user')
  }
  
  // Função para carregar user do localStorage
  const loadUserFromStorage = () => {
    if (typeof window !== 'undefined') {
      const userStr = localStorage.getItem('user')
      if (userStr) {
        try {
          const userData = JSON.parse(userStr)
          if (userData && userData.id) {
            user.value = {
              id: userData.id || null,
              name: userData.name || null,
              email: userData.email || null
            }
          }
        } catch (error) {
          console.error('Erro ao parsear user do localStorage:', error)
          localStorage.removeItem('user')
        }
      }
    }
  }
  
  // Inicializa carregando user do localStorage
  loadUserFromStorage()
  
  // Watch para detectar mudanças no localStorage do user
  if (typeof window !== 'undefined') {
    // Escuta mudanças no localStorage (de outras abas/contextos)
    window.addEventListener('storage', (e) => {
      if (e.key === 'user') {
        if (e.newValue) {
          try {
            const userData = JSON.parse(e.newValue)
            if (userData && userData.id) {
              user.value = {
                id: userData.id || null,
                name: userData.name || null,
                email: userData.email || null
              }
            }
          } catch (error) {
            console.error('Erro ao parsear user do storage event:', error)
          }
        } else {
          clearUser()
        }
      }
    })
    
    // Escuta eventos customizados de mudança no localStorage
    window.addEventListener('localStorageChange', (e) => {
      if (e.detail?.key === 'user') {
        if (e.detail?.newValue) {
          try {
            const userData = typeof e.detail.newValue === 'string' 
              ? JSON.parse(e.detail.newValue) 
              : e.detail.newValue
            if (userData && userData.id) {
              user.value = {
                id: userData.id || null,
                name: userData.name || null,
                email: userData.email || null
              }
            }
          } catch (error) {
            console.error('Erro ao parsear user do localStorageChange event:', error)
          }
        } else {
          clearUser()
        }
      }
    })
  }
  
  return {
    isSidebarOpen,
    isSettingsOpen,
    searchHistory,
    searchHistoryList,
    setSearchHistoryList,
    selectedSearch,
    searchQuery,
    setSearchQuery,
    preference,
    setPreference,
    searchSubmitData,
    setSearchSubmitData,
    orchestratorResponse,
    setOrchestratorResponse,
    isSearchLoading,
    setSearchLoading,
    dashboard,
    setDashboard,
    theme,
    effectiveTheme,
    isDark,
    initTheme,
    setTheme,
    isRecording,
    transcribedText,
    startRecording,
    stopRecording,
    setTranscribedText,
    clearTranscribedText,
    user,
    setUser,
    clearUser
  }
})
