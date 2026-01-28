<template>
  <div class="w-full max-w-3xl px-2 sm:px-0">
    <div 
      class="relative bg-white dark:bg-card rounded-2xl sm:rounded-3xl border p-2.5 sm:p-3 transition-colors"
      :class="[
        globalStore.isRecording 
          ? 'border-orange-500 dark:border-orange-500' 
          : (hasError || globalStore.searchError)
          ? 'border-red-500 dark:border-red-500'
          : 'border-gray-200 dark:border-border'
      ]"
    >
      <div class="mb-3 sm:mb-4 relative">
        <div 
          v-if="currentSuggestion && query"
          class="absolute inset-0 pointer-events-none px-2.5 sm:px-3.5 py-1.5 text-sm sm:text-[15px]"
        >
          <span class="invisible">{{ query }}</span><span class="text-gray-400 dark:text-muted-foreground/50">{{ currentSuggestion }}</span>
        </div>
        <input
          ref="inputRef"
          v-model="query"
          type="text"
          :placeholder="responsivePlaceholder"
          class="relative w-full px-2.5 sm:px-3.5 py-1.5 text-sm sm:text-[15px] text-gray-900 dark:text-foreground placeholder:text-gray-400 dark:placeholder:text-muted-foreground focus:outline-none bg-transparent"
          @keypress.enter="handleSubmit"
          @keydown.tab.prevent="acceptSuggestion"
        />
      </div>
      
      <div class="flex items-center justify-between flex-wrap gap-2">
        <div class="flex items-center gap-1 sm:gap-1.5">
          <Tooltip text="Complementar análise com dados de clima e tempo" position="bottom">
            <button
              @click="selectClimaTempo"
              :class="[
                'flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1.5 rounded-full text-xs sm:text-[14px] transition-all duration-200',
                climaTempo 
                  ? 'bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-300 dark:border-orange-500/50' 
                  : 'bg-gray-50 dark:bg-secondary text-gray-600 dark:text-muted-foreground border border-gray-200 dark:border-border hover:bg-gray-100 dark:hover:bg-accent'
              ]"
            >
              <Cloudy :size="14" class="sm:w-[15px] sm:h-[15px] flex-shrink-0" />
              <span class="hidden sm:inline">Clima e Tempo</span>
            </button>
          </Tooltip>
          
          
          <Tooltip text="Complementar análise com dados da qualidade do ar" position="bottom">
            <button
              @click="selectQualidadeAr"
              :class="[
                'flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1.5 rounded-full text-xs sm:text-[14px] transition-all duration-200',
                qualidadeAr 
                  ? 'bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-300 dark:border-orange-500/50' 
                  : 'bg-gray-50 dark:bg-secondary text-gray-600 dark:text-muted-foreground border border-gray-200 dark:border-border hover:bg-gray-100 dark:hover:bg-accent'
              ]"
            >
              <Wind :size="14" class="sm:w-[15px] sm:h-[15px] flex-shrink-0" />
              <span class="hidden sm:inline">Qualidade do Ar</span>
            </button>
          </Tooltip>
        </div>
        
         
        <div class="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
          <Tooltip text="Usar localização atual" position="bottom" mobile-position="right">
            <button
              @click="handleLocation"
              class="p-1.5 sm:p-2 text-gray-400 dark:text-muted-foreground hover:text-gray-600 dark:hover:text-foreground transition-colors"
            >
              <MapPin :size="16" class="sm:w-[18px] sm:h-[18px]" />
            </button>
          </Tooltip>

          <Tooltip 
            v-if="hasSpeechRecognition()"
            :text="globalStore.isRecording ? 'Parar gravação' : 'Transcrever mensagem com voz'" 
            position="bottom" mobile-position="right"
          >
            <button
              @click="handleVoiceInput"
              :class="[
                'p-1.5 sm:p-2 transition-colors',
                globalStore.isRecording 
                  ? 'text-red-500 animate-pulse' 
                  : 'text-gray-400 dark:text-muted-foreground hover:text-gray-600 dark:hover:text-foreground'
              ]"
            >
              <CircleStop v-if="globalStore.isRecording" :size="16" class="sm:w-[18px] sm:h-[18px]" />
              <Mic v-else :size="16" class="sm:w-[18px] sm:h-[18px]" />
            </button>
          </Tooltip>
          
          <Tooltip text="Enviar mensagem" position="bottom">
            <button
              @click="handleSubmit"
              :disabled="!query.trim()"
              :class="[
                'p-1.5 sm:p-2 rounded-lg sm:rounded-xl transition-all duration-200',
                query.trim() 
                  ? 'bg-orange-500 text-white hover:bg-orange-600' 
                  : 'bg-gray-100 dark:bg-accent text-gray-400 dark:text-muted-foreground cursor-not-allowed'
              ]"
            >
              <ArrowUp :size="16" class="sm:w-[18px] sm:h-[18px]" />
            </button>
          </Tooltip>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { Cloudy, Wind, MapPin, Mic, CircleStop, ArrowUp } from 'lucide-vue-next'
import Tooltip from './Tooltip.vue'
import { useGlobalStore } from '@/stores/global'
import { useAuthStore } from '@/stores/auth'
import { orchestratorService, getAllSearchHistoryService } from '@/api/services'
import micInSound from '@/assets/mic-in.wav'
import micOutSound from '@/assets/mic-out.wav'
import api from '@/api/axios'

const globalStore = useGlobalStore()
const authStore = useAuthStore()

const windowWidth = ref(typeof window !== 'undefined' ? window.innerWidth : 640)
const inputRef = ref(null)
const suggestions = ref([])
const currentSuggestion = ref('')
const hasError = computed(() => !!globalStore.searchError)
let searchTimeout = null

let handleResize = null

onMounted(() => {
  handleResize = () => {
    windowWidth.value = window.innerWidth
  }
  window.addEventListener('resize', handleResize)
})

let recognition = null
const audioContext = ref(null)
let baseText = ''

const micInAudio = new Audio(micInSound)
const micOutAudio = new Audio(micOutSound)

micInAudio.preload = 'auto'
micOutAudio.preload = 'auto'

const props = defineProps({
  placeholder: {
    type: String,
    default: 'Digite sua mensagem...'
  },
  modelValue: {
    type: String,
    default: ''
  }
})

const query = computed({
  get: () => globalStore.searchQuery,
  set: (value) => globalStore.setSearchQuery(value)
})

watch(query, (newValue) => {
  if (globalStore.searchError) {
    globalStore.clearSearchError()
  }
  
  if (searchTimeout) {
    clearTimeout(searchTimeout)
  }

  if (typeof newValue !== 'string') {
    return
  }

  const searchText = newValue.trim()

  if (searchText.length < 3) {
    suggestions.value = []
    currentSuggestion.value = ''
    return
  }

  searchTimeout = setTimeout(() => {
    searchMunicipios(searchText)
  }, 300)
})

const responsivePlaceholder = computed(() => {
  if (windowWidth.value < 640) {
    if (props.placeholder.includes('cidade')) {
      return 'Digite cidade ou coordenadas...'
    }
    return props.placeholder.length > 30 
      ? props.placeholder.substring(0, 30) + '...'
      : props.placeholder
  }
  return props.placeholder
})

const climaTempo = computed(() => globalStore.preference === 'weather')
const qualidadeAr = computed(() => globalStore.preference === 'air')

const selectClimaTempo = () => {
  globalStore.setPreference('weather')
}

const selectQualidadeAr = () => {
  globalStore.setPreference('air')
}

const handleLocation = () => {
  navigator.geolocation.getCurrentPosition((position) => {
    const latitude = position.coords.latitude.toFixed(2)
    const longitude = position.coords.longitude.toFixed(2)
    const coords = `${latitude}, ${longitude}`
    globalStore.setSearchQuery(coords)
  }, (error) => {
    console.error('Erro ao obter localização:', error)
    alert('Não foi possível obter sua localização. Verifique se a permissão de localização está habilitada.')
  }, {
    timeout: 5000,
    maximumAge: 0,
    enableHighAccuracy: true
  })
}

const searchMunicipios = async (searchText) => {
  if (searchText.length < 2) {
    suggestions.value = []
    currentSuggestion.value = ''
    return
  }

  try {
    const response = await api.post('/geocoding/search-municipios', {
      query: searchText
    })

    if (response.data && response.data.length > 0) {
      suggestions.value = response.data.slice(0, 10).map(item => {
        const municipio = item.name
        const uf = item.siglaUf || ''
        const displayName = uf ? `${municipio} - ${uf}` : municipio

        return {
          text: displayName,
          municipio: municipio,
          uf: uf,
          id: item.cdMun
        }
      })

      if (suggestions.value.length > 0) {
        const firstSuggestion = suggestions.value[0].text
        
        const normalizeText = (text) => {
          return text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
        }
        
        const searchNormalized = normalizeText(searchText)
        const suggestionNormalized = normalizeText(firstSuggestion)
        
        if (suggestionNormalized.startsWith(searchNormalized)) {
          currentSuggestion.value = firstSuggestion.slice(searchText.length)
        } else {
          currentSuggestion.value = ''
        }
      }
    } else {
      suggestions.value = []
      currentSuggestion.value = ''
    }
  } catch (error) {
    console.error('Erro ao buscar municípios:', error)
    suggestions.value = []
    currentSuggestion.value = ''
  }
}

const acceptSuggestion = () => {
  if (currentSuggestion.value && suggestions.value.length > 0) {
    globalStore.setSearchQuery(suggestions.value[0].text)
    currentSuggestion.value = ''
    suggestions.value = []
  }
}

const getUserId = () => {
  let userId = globalStore.user?.id
  
  if (!userId) {
    const userStr = localStorage.getItem('user')
    if (userStr) {
      try {
        const user = JSON.parse(userStr)
        userId = user?.id
        if (userId) {
          globalStore.setUser(user)
        }
      } catch (e) {
        console.warn('Erro ao parsear user do localStorage:', e)
      }
    }
  }
  
  if (!userId || userId === 'null' || userId === 'undefined' || String(userId).trim() === '') {
    console.warn('UserId não encontrado. Verifique se está logado corretamente.')
    throw new Error('Usuário não autenticado. Por favor, faça login novamente.')
  }
  
  return String(userId).trim()
}

const extractErrorMessage = (error) => {
  if (error.response?.data) {
    const data = error.response.data
    
    if ('error' in data && data.error !== undefined && data.error !== null) {
      if (typeof data.error === 'string' && data.error.trim().length > 0) {
        return data.error.trim()
      }
      if (typeof data.error === 'object') {
        return JSON.stringify(data.error)
      }
    }
    
    if (data.errors && Array.isArray(data.errors) && data.errors.length > 0) {
      return data.errors.map(err => err.erro || err.message || err).join(', ')
    }
    
    if (data.message && !('error' in data)) {
      if (typeof data.message === 'string' && data.message.trim().length > 0) {
        return data.message.trim()
      }
      if (typeof data.message === 'object') {
        return JSON.stringify(data.message)
      }
    }
    
    if (typeof data === 'object' && data !== null) {
      if ('error' in data && typeof data.error === 'string' && data.error.trim().length > 0) {
        return data.error.trim()
      }
      for (const key in data) {
        if (key !== 'statusCode' && typeof data[key] === 'string' && data[key].trim().length > 0) {
          return data[key].trim()
        }
      }
    }
  }
  
  if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
    return 'Tempo de espera esgotado. Tente novamente.'
  }
  
  if (error.message) {
    return error.message
  }
  
  return 'Erro ao processar a pesquisa. Tente novamente.'
}

const handleSubmit = async () => {
  if (query.value.trim()) {
    globalStore.clearSearchError()
    
    globalStore.setSearchLoading(true)
    
    try {
      const userId = getUserId()
      const searchQuery = query.value.trim()
      
      if (!searchQuery || searchQuery.length === 0) {
        throw new Error('Query não pode estar vazia')
      }
      
      if (!userId || userId.length === 0) {
        throw new Error('UserId não pode estar vazio')
      }
      
      const orchestratorResponse = await orchestratorService.search(searchQuery, userId, globalStore.preference)
      globalStore.setOrchestratorResponse(orchestratorResponse)
      
      globalStore.setSearchSubmitData({
        query: searchQuery,
        climaTempo: climaTempo.value,
        qualidadeAr: qualidadeAr.value
      })
      
      try {
        const history = await getAllSearchHistoryService(userId)
        globalStore.setSearchHistoryList(history)
      } catch (historyError) {
        console.error('Erro ao atualizar histórico:', historyError)
      }
    } catch (error) {
      console.error('Erro ao buscar dados:', error)
      
      if (error.response) {
        console.error('Response status:', error.response.status)
        console.error('Response data:', error.response.data)
      }
      
      const message = extractErrorMessage(error)
      
      if (message && message.trim().length > 0) {
        globalStore.setSearchError(message.trim())
      }
      
      if (error.message && error.message.includes('autenticado')) {
        alert(error.message)
      }
      
      globalStore.setSearchSubmitData({
        query: query.value,
        climaTempo: climaTempo.value,
        qualidadeAr: qualidadeAr.value
      })
    } finally {
      globalStore.setSearchLoading(false)
    }
  }
}

const isSafari = () => {
  return /^((?!chrome|android).)*safari/i.test(navigator.userAgent)
}

const isFirefox = () => {
  return navigator.userAgent.toLowerCase().indexOf('firefox') > -1
}

const hasSpeechRecognition = () => {
  return 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window
}

const playMicInSound = () => {
  if (isSafari()) {
    return
  }
  
  try {
    micInAudio.currentTime = 0
    micInAudio.play().catch(e => {
      console.warn('Erro ao tocar som de início:', e)
    })
  } catch (e) {
    console.warn('Erro ao tocar som de início:', e)
  }
}

const playMicOutSound = () => {
  if (isSafari()) {
    return
  }
  
  try {
    micOutAudio.currentTime = 0
    micOutAudio.play().catch(e => {
      console.warn('Erro ao tocar som de fim:', e)
    })
  } catch (e) {
    console.warn('Erro ao tocar som de fim:', e)
  }
}

const initSpeechRecognition = () => {
  if (!hasSpeechRecognition()) {
    console.warn('Web Speech API não suportada neste navegador')
    return null
  }
  
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
  
  const rec = new SpeechRecognition()
  rec.continuous = true
  rec.interimResults = true
  rec.lang = 'pt-BR'
  
  rec.onresult = (event) => {
    let finalTranscript = ''
    let interimTranscript = ''
    
    for (let i = event.resultIndex; i < event.results.length; i++) {
      const transcript = event.results[i][0].transcript
      if (event.results[i].isFinal) {
        finalTranscript += transcript + ' '
      } else {
        interimTranscript += transcript
      }
    }
    
    if (finalTranscript) {
      baseText = baseText + finalTranscript.trim() + ' '
      globalStore.setSearchQuery(baseText.trim())
    }
    
    if (interimTranscript) {
      const currentText = baseText + interimTranscript
      globalStore.setSearchQuery(currentText)
    } else if (!finalTranscript) {
      globalStore.setSearchQuery(baseText.trim())
    }
  }
  
  rec.onerror = (event) => {
    console.error('Erro no reconhecimento de voz:', event.error)
    
    if (event.error === 'no-speech' || event.error === 'aborted') {
      return
    }
    
    if (event.error === 'network') {
      console.warn('Erro de rede no reconhecimento, tentando reiniciar...')
      if (globalStore.isRecording && recognition) {
        setTimeout(() => {
          if (globalStore.isRecording) {
            try {
              recognition.stop()
              setTimeout(() => {
                if (globalStore.isRecording && recognition) {
                  recognition.start()
                }
              }, 200)
            } catch (e) {
              console.warn('Erro ao reiniciar após network error:', e)
            }
          }
        }, 500)
      }
      return
    }
    
    if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
      alert('Permissão de microfone negada. Por favor, permita o acesso ao microfone.')
      stopVoiceRecording()
    } else if (event.error === 'audio-capture') {
      alert('Nenhum microfone detectado. Verifique se há um microfone conectado.')
      stopVoiceRecording()
    } else {
      console.warn('Erro no reconhecimento:', event.error, '- tentando continuar...')
    }
  }
  
  rec.onend = () => {
    if (globalStore.isRecording) {
      setTimeout(() => {
        if (globalStore.isRecording && recognition) {
          try {
            recognition.start()
          } catch (e) {
            if (e.name !== 'InvalidStateError') {
              console.error('Erro ao reiniciar reconhecimento:', e)
              stopVoiceRecording()
            }
          }
        }
      }, 100)
    }
  }
  
  return rec
}

const startVoiceRecording = () => {
  baseText = query.value || ''
  
  if (!recognition) {
    recognition = initSpeechRecognition()
  }
  
  if (!recognition) {
    alert('Seu navegador não suporta reconhecimento de voz')
    return
  }
  
  try {
    playMicInSound()
    globalStore.startRecording()
    recognition.start()
  } catch (e) {
    console.error('Erro ao iniciar gravação:', e)
    if (e.name === 'InvalidStateError') {
      recognition = initSpeechRecognition()
      try {
        recognition.start()
        globalStore.startRecording()
      } catch (e2) {
        console.error('Erro ao reiniciar reconhecimento:', e2)
        globalStore.stopRecording()
      }
    } else {
      globalStore.stopRecording()
    }
  }
}

const stopVoiceRecording = () => {
  if (recognition) {
    try {
      recognition.stop()
    } catch (e) {
      console.warn('Erro ao parar reconhecimento:', e)
    }
  }
  
  if (baseText.trim()) {
    globalStore.setSearchQuery(baseText.trim())
  }
  
  playMicOutSound()
  globalStore.stopRecording()
}

const handleVoiceInput = () => {
  if (globalStore.isRecording) {
    stopVoiceRecording()
  } else {
    startVoiceRecording()
  }
}

if (props.modelValue) {
  globalStore.setSearchQuery(props.modelValue)
}

onUnmounted(() => {
  if (recognition) {
    try {
      recognition.stop()
    } catch (e) {}
  }
  if (handleResize) {
    window.removeEventListener('resize', handleResize)
  }
  if (searchTimeout) {
    clearTimeout(searchTimeout)
  }
  globalStore.stopRecording()
  globalStore.clearTranscribedText()
})
</script>

<style scoped>
.error-fade-enter-active,
.error-fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.error-fade-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}

.error-fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
