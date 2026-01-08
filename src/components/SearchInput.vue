<template>
  <div class="w-full max-w-3xl px-2 sm:px-0">
    <div 
      class="relative bg-white dark:bg-card rounded-2xl sm:rounded-3xl border p-2.5 sm:p-3 transition-colors"
      :class="globalStore.isRecording 
        ? 'border-orange-500 dark:border-orange-500' 
        : 'border-gray-200 dark:border-border'"
    >
      <div class="mb-3 sm:mb-4">
        <input
          v-model="query"
          type="text"
          :placeholder="responsivePlaceholder"
          class="w-full px-2.5 sm:px-3.5 py-1.5 text-sm sm:text-[15px] text-gray-900 dark:text-foreground placeholder:text-gray-400 dark:placeholder:text-muted-foreground focus:outline-none bg-transparent"
          @keypress.enter="handleSubmit"
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
import { orchestratorService } from '@/api/services'
import micInSound from '@/assets/mic-in.wav'
import micOutSound from '@/assets/mic-out.wav'

const globalStore = useGlobalStore()
const authStore = useAuthStore()

const windowWidth = ref(typeof window !== 'undefined' ? window.innerWidth : 640)

let handleResize = null

onMounted(() => {
  handleResize = () => {
    windowWidth.value = window.innerWidth
  }
  window.addEventListener('resize', handleResize)
})

// Web Speech API
let recognition = null
const audioContext = ref(null)
let baseText = '' // Texto base sem interim

// Áudios pré-carregados
const micInAudio = new Audio(micInSound)
const micOutAudio = new Audio(micOutSound)

// Preload dos áudios
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

// Usa o query do store ao invés de props
const query = computed({
  get: () => globalStore.searchQuery,
  set: (value) => globalStore.setSearchQuery(value)
})

// Placeholder responsivo - mais curto em telas pequenas
const responsivePlaceholder = computed(() => {
  if (windowWidth.value < 640) {
    // Placeholder curto para mobile
    if (props.placeholder.includes('cidade')) {
      return 'Digite cidade ou coordenadas...'
    }
    return props.placeholder.length > 30 
      ? props.placeholder.substring(0, 30) + '...'
      : props.placeholder
  }
  return props.placeholder
})

// Usa preference do store, default é 'weather'
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

// Função auxiliar para obter o userId
const getUserId = () => {
  // Tenta pegar do store global primeiro
  let userId = globalStore.user?.id
  
  // Se não tiver no store, tenta pegar do localStorage
  if (!userId) {
    const userStr = localStorage.getItem('user')
    if (userStr) {
      try {
        const user = JSON.parse(userStr)
        userId = user?.id
        // Se encontrou o userId no localStorage, atualiza o store
        if (userId) {
          globalStore.setUser(user)
        }
      } catch (e) {
        console.warn('Erro ao parsear user do localStorage:', e)
      }
    }
  }
  
  // Valida se o userId é válido (não null, undefined, ou string vazia)
  if (!userId || userId === 'null' || userId === 'undefined' || String(userId).trim() === '') {
    console.warn('UserId não encontrado. Verifique se está logado corretamente.')
    // Não usa 'anonymous' - exige que o usuário esteja logado
    throw new Error('Usuário não autenticado. Por favor, faça login novamente.')
  }
  
  // Garante que userId é uma string válida
  return String(userId).trim()
}

const handleSubmit = async () => {
  if (query.value.trim()) {
    globalStore.setSearchLoading(true)
    
    try {
      const userId = getUserId()
      const searchQuery = query.value.trim()
      
      // Valida se query e userId são válidos
      if (!searchQuery || searchQuery.length === 0) {
        throw new Error('Query não pode estar vazia')
      }
      
      if (!userId || userId.length === 0) {
        throw new Error('UserId não pode estar vazio')
      }
      
      console.log('Enviando busca:', { query: searchQuery, userId, preference: globalStore.preference })
      
      // POST único para /api/orchestrator/search
      const orchestratorResponse = await orchestratorService.search(searchQuery, userId, globalStore.preference)
      globalStore.setOrchestratorResponse(orchestratorResponse)
      
      globalStore.setSearchSubmitData({
        query: searchQuery,
        climaTempo: climaTempo.value,
        qualidadeAr: qualidadeAr.value
      })
    } catch (error) {
      console.error('Erro ao buscar dados:', error)
      if (error.response) {
        console.error('Response status:', error.response.status)
        console.error('Response data:', error.response.data)
      }
      // Mostra mensagem de erro ao usuário se for erro de autenticação
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

// Detecta se é Safari
const isSafari = () => {
  return /^((?!chrome|android).)*safari/i.test(navigator.userAgent)
}

// Detecta se é Firefox
const isFirefox = () => {
  return navigator.userAgent.toLowerCase().indexOf('firefox') > -1
}

// Verifica suporte para Web Speech API
const hasSpeechRecognition = () => {
  return 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window
}

// Função para tocar som de início de gravação
const playMicInSound = () => {
  // Safari usa apenas o som padrão do sistema
  if (isSafari()) {
    return
  }
  
  try {
    micInAudio.currentTime = 0 // Reinicia o áudio
    micInAudio.play().catch(e => {
      console.warn('Erro ao tocar som de início:', e)
    })
  } catch (e) {
    console.warn('Erro ao tocar som de início:', e)
  }
}

// Função para tocar som de fim de gravação
const playMicOutSound = () => {
  // Safari usa apenas o som padrão do sistema
  if (isSafari()) {
    return
  }
  
  try {
    micOutAudio.currentTime = 0 // Reinicia o áudio
    micOutAudio.play().catch(e => {
      console.warn('Erro ao tocar som de fim:', e)
    })
  } catch (e) {
    console.warn('Erro ao tocar som de fim:', e)
  }
}

// Inicializa Web Speech API
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
    
    // Se há texto final, adiciona ao base e atualiza
    if (finalTranscript) {
      baseText = baseText + finalTranscript.trim() + ' '
      globalStore.setSearchQuery(baseText.trim())
    }
    
    // Mostra texto interim enquanto fala (temporário, não adiciona ao base)
    if (interimTranscript) {
      const currentText = baseText + interimTranscript
      globalStore.setSearchQuery(currentText)
    } else if (!finalTranscript) {
      // Se não há interim nem final, mantém apenas o base
      globalStore.setSearchQuery(baseText.trim())
    }
  }
  
  rec.onerror = (event) => {
    console.error('Erro no reconhecimento de voz:', event.error)
    
    // Ignora erros não críticos
    if (event.error === 'no-speech' || event.error === 'aborted') {
      return
    }
    
    // Erro de rede - tenta reiniciar automaticamente
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
    
    // Erros críticos que param a gravação
    if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
      alert('Permissão de microfone negada. Por favor, permita o acesso ao microfone.')
      stopVoiceRecording()
    } else if (event.error === 'audio-capture') {
      alert('Nenhum microfone detectado. Verifique se há um microfone conectado.')
      stopVoiceRecording()
    } else {
      // Outros erros - tenta continuar mas loga
      console.warn('Erro no reconhecimento:', event.error, '- tentando continuar...')
    }
  }
  
  rec.onend = () => {
    if (globalStore.isRecording) {
      // Reinicia se ainda estiver gravando (para manter contínuo)
      // Usa setTimeout para evitar erro de "already started"
      setTimeout(() => {
        if (globalStore.isRecording && recognition) {
          try {
            recognition.start()
          } catch (e) {
            // Se já estiver rodando, ignora o erro
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
  // Inicializa o texto base com o que já está no input
  baseText = query.value || ''
  
  // Recria o recognition se necessário (pode ter sido destruído)
  if (!recognition) {
    recognition = initSpeechRecognition()
  }
  
  if (!recognition) {
    alert('Seu navegador não suporta reconhecimento de voz')
    return
  }
  
  try {
    playMicInSound() // Toca som de início
    globalStore.startRecording()
    recognition.start()
  } catch (e) {
    console.error('Erro ao iniciar gravação:', e)
    // Se der erro, tenta recriar o recognition
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
  
  // Garante que o texto final está salvo (sem interim)
  if (baseText.trim()) {
    globalStore.setSearchQuery(baseText.trim())
  }
  
  playMicOutSound() // Toca som de fim
  globalStore.stopRecording()
}

const handleVoiceInput = () => {
  if (globalStore.isRecording) {
    stopVoiceRecording()
  } else {
    startVoiceRecording()
  }
}

// Inicializa o query do store se tiver valor inicial
if (props.modelValue) {
  globalStore.setSearchQuery(props.modelValue)
}

// Limpa ao desmontar
onUnmounted(() => {
  if (recognition) {
    try {
      recognition.stop()
    } catch (e) {}
  }
  if (handleResize) {
    window.removeEventListener('resize', handleResize)
  }
  globalStore.stopRecording()
  globalStore.clearTranscribedText()
})
</script>
