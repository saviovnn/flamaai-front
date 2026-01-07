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
  const searchHistory = ref({
    'taubate-12-01-2025': {
      risco: ['alto', 'medio'],
      risco_medio: 'alto',
      humidade: [60, 70, 65],
      temperatura: [28, 30, 29],
      explicacao: 'Análise de risco climático para Taubaté em janeiro.'
    },
    'sao-bento-20-02-2025': {
      risco: ['baixo', 'baixo'],
      risco_medio: 'baixo',
      humidade: [55, 58, 60],
      temperatura: [25, 26, 27],
      explicacao: 'Condições favoráveis em São Bento no mês de fevereiro.'
    },
    'campinas-05-03-2025': {
      risco: ['alto', 'alto'],
      risco_medio: 'alto',
      humidade: [50, 52, 55],
      temperatura: [32, 33, 34],
      explicacao: 'Alerta de calor intenso em Campinas em março.'
    },
    'rio-de-janeiro-12-04-2025': {
      risco: ['medio', 'baixo'],
      risco_medio: 'baixo',
      humidade: [70, 65, 68],
      temperatura: [28, 27, 26],
      explicacao: 'Clima ameno no Rio de Janeiro.'
    },
    'santos-22-05-2025': {
      risco: ['baixo', 'baixo'],
      risco_medio: 'baixo',
      humidade: [80, 82, 85],
      temperatura: [24, 23, 22],
      explicacao: 'Alta humidade e temperaturas leves em Santos.'
    },
    'curitiba-14-06-2025': {
      risco: ['medio', 'medio'],
      risco_medio: 'medio',
      humidade: [60, 65, 63],
      temperatura: [20, 18, 19],
      explicacao: 'Possibilidade de frio em Curitiba.'
    },
    'recife-01-07-2025': {
      risco: ['baixo', 'medio'],
      risco_medio: 'baixo',
      humidade: [75, 78, 80],
      temperatura: [26, 27, 28],
      explicacao: 'Chuvas rápidas em Recife.'
    },
    'fortaleza-17-08-2025': {
      risco: ['baixo', 'baixo'],
      risco_medio: 'baixo',
      humidade: [70, 72, 73],
      temperatura: [29, 30, 31],
      explicacao: 'Tempo firme em Fortaleza.'
    },
    'porto-alegre-09-09-2025': {
      risco: ['medio', 'alto'],
      risco_medio: 'medio',
      humidade: [60, 62, 61],
      temperatura: [22, 23, 24],
      explicacao: 'Oscilação de temperatura em Porto Alegre.'
    },
    'belem-23-10-2025': {
      risco: ['alto', 'medio'],
      risco_medio: 'medio',
      humidade: [85, 86, 87],
      temperatura: [33, 34, 32],
      explicacao: 'Calor e umidade elevados em Belém.'
    },
    'manaus-02-11-2025': {
      risco: ['alto', 'alto'],
      risco_medio: 'alto',
      humidade: [90, 92, 93],
      temperatura: [34, 35, 36],
      explicacao: 'Muito quente e úmido em Manaus em novembro.'
    },
    'florianopolis-11-12-2025': {
      risco: ['baixo', 'medio'],
      risco_medio: 'baixo',
      humidade: [77, 78, 80],
      temperatura: [27, 26, 25],
      explicacao: 'Temperatura agradável em Florianópolis.'
    },
    'salvador-15-01-2025': {
      risco: ['baixo', 'baixo'],
      risco_medio: 'baixo',
      humidade: [74, 76, 75],
      temperatura: [28, 29, 28],
      explicacao: 'Verão tipicamente quente em Salvador.'
    },
    'brasilia-03-02-2025': {
      risco: ['medio', 'medio'],
      risco_medio: 'medio',
      humidade: [60, 62, 63],
      temperatura: [24, 25, 26],
      explicacao: 'Tempo estável em Brasília.'
    },
    'goiania-19-03-2025': {
      risco: ['alto', 'medio'],
      risco_medio: 'medio',
      humidade: [58, 60, 62],
      temperatura: [31, 32, 33],
      explicacao: 'Aviso de calor em Goiânia.'
    },
    'Belo Horizonte-12-04-2025': {
      risco: ['baixo', 'baixo'],
      risco_medio: 'baixo',
      humidade: [66, 65, 67],
      temperatura: [22, 23, 21],
      explicacao: 'Tempo agradável em BH.'
    },
    'natal-28-05-2025': {
      risco: ['baixo', 'medio'],
      risco_medio: 'baixo',
      humidade: [78, 80, 79],
      temperatura: [29, 30, 31],
      explicacao: 'Chuva rápida em Natal.'
    },
    'aracaju-07-06-2025': {
      risco: ['medio', 'baixo'],
      risco_medio: 'medio',
      humidade: [72, 74, 73],
      temperatura: [27, 28, 26],
      explicacao: 'Variabilidade climática em Aracaju.'
    },
    'joao-pessoa-21-07-2025': {
      risco: ['baixo', 'baixo'],
      risco_medio: 'baixo',
      humidade: [75, 76, 77],
      temperatura: [28, 27, 29],
      explicacao: 'Clima estável em João Pessoa.'
    },
    'teresina-15-08-2025': {
      risco: ['alto', 'alto'],
      risco_medio: 'medio',
      humidade: [60, 62, 61],
      temperatura: [36, 37, 35],
      explicacao: 'Sol muito quente em Teresina.'
    },
    'vitoria-03-09-2025': {
      risco: ['baixo', 'medio'],
      risco_medio: 'baixo',
      humidade: [68, 70, 69],
      temperatura: [26, 25, 27],
      explicacao: 'Variação de temperatura em Vitória.'
    },
    'petropolis-29-10-2025': {
      risco: ['medio', 'medio'],
      risco_medio: 'medio',
      humidade: [72, 74, 71],
      temperatura: [20, 21, 22],
      explicacao: 'Clima serrano em Petrópolis.'
    },
    'guarulhos-10-11-2025': {
      risco: ['baixo', 'baixo'],
      risco_medio: 'baixo',
      humidade: [69, 68, 70],
      temperatura: [24, 25, 23],
      explicacao: 'Condições agradáveis em Guarulhos.'
    },
    'maceio-12-12-2025': {
      risco: ['alto', 'medio'],
      risco_medio: 'baixo',
      humidade: [81, 82, 80],
      temperatura: [30, 32, 31],
      explicacao: 'Previsão de calor e alta umidade em Maceió.'
    }
  })
  const selectedSearch = ref(null)
  
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
