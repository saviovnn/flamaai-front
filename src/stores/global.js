import { ref, computed, watch } from 'vue'
import { defineStore } from 'pinia'

export const useGlobalStore = defineStore('global', () => {
  const isSidebarOpen = ref(false)
  const isSettingsOpen = ref(false)
  
  const theme = ref('system')
  const locale = ref('pt')

  const effectiveTheme = computed(() => {
    if (theme.value === 'system') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    }
    return theme.value
  })
  
  const isDark = computed(() => effectiveTheme.value === 'dark')
  
  const applyTheme = () => {
    const favicon = document.getElementById('favicon')
    const effective = effectiveTheme.value
    
    if (effective === 'dark') {
      document.documentElement.classList.add('dark')
      if (favicon) favicon.href = '/logo-dark.svg'
    } else {
      document.documentElement.classList.remove('dark')
      if (favicon) favicon.href = '/logo.svg'
    }
  }
  
  const initTheme = () => {
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme && ['light', 'dark', 'system'].includes(savedTheme)) {
      theme.value = savedTheme
    } else {
      theme.value = 'system'
      localStorage.setItem('theme', 'system')
    }
    
    if (window.matchMedia) {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
      mediaQuery.addEventListener('change', () => {
        if (theme.value === 'system') {
          applyTheme()
        }
      })
    }
    
    applyTheme()
  }
  
  const setTheme = (newTheme) => {
    if (['light', 'dark', 'system'].includes(newTheme)) {
      theme.value = newTheme
      localStorage.setItem('theme', newTheme)
      applyTheme()
    }
  }

  const initLocale = () => {
    if (typeof window === 'undefined') return
    const saved = localStorage.getItem('locale')
    if (saved && ['pt', 'en', 'es'].includes(saved)) {
      locale.value = saved
      return
    }
    const browserLang = (
      navigator.language ||
      navigator.userLanguage ||
      (navigator.languages && navigator.languages[0]) ||
      'en'
    ).toLowerCase().split('-')[0]
    if (browserLang === 'pt') {
      locale.value = 'pt'
    } else if (browserLang === 'es') {
      locale.value = 'es'
    } else {
      locale.value = 'en'
    }
    localStorage.setItem('locale', locale.value)
  }

  const setLocale = (newLocale) => {
    if (['pt', 'en', 'es'].includes(newLocale)) {
      locale.value = newLocale
      if (typeof window !== 'undefined') {
        localStorage.setItem('locale', newLocale)
      }
    }
  }
  
  watch(theme, () => {
    applyTheme()
  })
  
  watch(effectiveTheme, () => {
    applyTheme()
  })
  const searchHistory = ref({})
  const searchHistoryList = ref([])
  const selectedSearch = ref(null)
  
  const setSearchHistoryList = (historyArray) => {
    searchHistoryList.value = historyArray || []
  }
  
  const searchQuery = ref('')
  
  const setSearchQuery = (query) => {
    searchQuery.value = query
  }
  
  const preference = ref('weather')
  
  const setPreference = (pref) => {
    if (pref === 'weather' || pref === 'air') {
      preference.value = pref
    }
  }
  
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
  
  const orchestratorResponse = ref(null)
  
  const setOrchestratorResponse = (data) => {
    orchestratorResponse.value = data
  }
  
  const isSearchLoading = ref(false)
  
  const setSearchLoading = (loading) => {
    isSearchLoading.value = loading
  }
  
  const searchError = ref('')
  
  const setSearchError = (errorMessage) => {
    searchError.value = errorMessage || ''
  }
  
  const clearSearchError = () => {
    searchError.value = ''
  }
  
  const dashboard = ref(false)
  
  const setDashboard = (value) => {
    dashboard.value = value
  }
  
  watch(orchestratorResponse, (response) => {
    if (response) {
      dashboard.value = true
    } else {
      dashboard.value = false
    }
  }, { deep: true })
  
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
  
  loadUserFromStorage()
  
  if (typeof window !== 'undefined') {
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
  
  initLocale()

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
    locale,
    initLocale,
    setLocale,
    isRecording,
    transcribedText,
    startRecording,
    stopRecording,
    setTranscribedText,
    clearTranscribedText,
    user,
    setUser,
    clearUser,
    searchError,
    setSearchError,
    clearSearchError
  }
})
