<template>
  <div class="w-full max-w-3xl">
    <div 
      class="relative bg-white dark:bg-card rounded-3xl border p-3 transition-colors"
      :class="globalStore.isRecording 
        ? 'border-orange-500 dark:border-orange-500' 
        : 'border-gray-200 dark:border-border'"
    >
      <div class="mb-4">
        <input
          v-model="query"
          type="text"
          :placeholder="placeholder"
          class="w-full px-3.5 py-1.5 text-[15px] text-gray-900 dark:text-foreground placeholder:text-gray-400 dark:placeholder:text-muted-foreground focus:outline-none bg-transparent"
          @keypress.enter="handleSubmit"
        />
      </div>
      
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-1.5">
          <Tooltip text="Complementar análise com dados de clima e tempo" position="bottom">
            <button
              @click="selectClimaTempo"
              :class="[
                'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[14px] transition-all duration-200',
                climaTempo 
                  ? 'bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-300 dark:border-orange-500/50' 
                  : 'bg-gray-50 dark:bg-secondary text-gray-600 dark:text-muted-foreground border border-gray-200 dark:border-border hover:bg-gray-100 dark:hover:bg-accent'
              ]"
            >
              <Cloudy :size="15" />
              Clima e Tempo
            </button>
          </Tooltip>
          
          
          <Tooltip text="Complementar análise com dados da qualidade do ar" position="bottom">
            <button
              @click="selectQualidadeAr"
              :class="[
                'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[14px] transition-all duration-200',
                qualidadeAr 
                  ? 'bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-300 dark:border-orange-500/50' 
                  : 'bg-gray-50 dark:bg-secondary text-gray-600 dark:text-muted-foreground border border-gray-200 dark:border-border hover:bg-gray-100 dark:hover:bg-accent'
              ]"
            >
              <Wind :size="15" />
              Qualidade do Ar
            </button>
          </Tooltip>
        </div>
        
         
        <div class="flex items-center gap-2">
          <Tooltip text="Usar localização atual" position="bottom">
            <button
              @click="handleLocation"
              class="p-2 text-gray-400 dark:text-muted-foreground hover:text-gray-600 dark:hover:text-foreground transition-colors"
            >
              <MapPin :size="18" />
            </button>
          </Tooltip>

          <Tooltip 
            v-if="hasSpeechRecognition()"
            :text="globalStore.isRecording ? 'Parar gravação' : 'Transcrever mensagem com voz'" 
            position="bottom"
          >
            <button
              @click="handleVoiceInput"
              :class="[
                'p-2 transition-colors',
                globalStore.isRecording 
                  ? 'text-red-500 animate-pulse' 
                  : 'text-gray-400 dark:text-muted-foreground hover:text-gray-600 dark:hover:text-foreground'
              ]"
            >
              <CircleStop v-if="globalStore.isRecording" :size="18" />
              <Mic v-else :size="18" />
            </button>
          </Tooltip>
          
          <Tooltip text="Enviar mensagem" position="bottom">
            <button
              @click="handleSubmit"
              :disabled="!query.trim()"
              :class="[
                'p-2 rounded-xl transition-all duration-200',
                query.trim() 
                  ? 'bg-orange-500 text-white hover:bg-orange-600' 
                  : 'bg-gray-100 dark:bg-accent text-gray-400 dark:text-muted-foreground cursor-not-allowed'
              ]"
            >
              <ArrowUp :size="18" />
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
import micInSound from '@/assets/mic-in.wav'
import micOutSound from '@/assets/mic-out.wav'

const globalStore = useGlobalStore()

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

const emit = defineEmits(['submit'])

// Usa o query do store ao invés de props
const query = computed({
  get: () => globalStore.searchQuery,
  set: (value) => globalStore.setSearchQuery(value)
})
const climaTempo = ref(true)
const qualidadeAr = ref(false)

const selectClimaTempo = () => {
  climaTempo.value = true
  qualidadeAr.value = false
}

const selectQualidadeAr = () => {
  qualidadeAr.value = true
  climaTempo.value = false
}

const handleLocation = () => {
  navigator.geolocation.getCurrentPosition((position) => {
    const latitude = position.coords.latitude.toFixed(2)
    const longitude = position.coords.longitude.toFixed(2)
    const coords = `latitude: ${latitude}, longitude: ${longitude}`
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

const handleSubmit = () => {
  if (query.value.trim()) {
    emit('submit', {
      query: query.value,
      climaTempo: climaTempo.value,
      qualidadeAr: qualidadeAr.value
    })
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
  globalStore.stopRecording()
  globalStore.clearTranscribedText()
})
</script>
