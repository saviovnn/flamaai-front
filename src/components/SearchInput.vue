<template>
  <div class="w-full max-w-3xl">
    <div class="relative bg-white rounded-3xl border border-gray-200 p-3">
      <div class="mb-4">
        <input
          v-model="query"
          type="text"
          :placeholder="placeholder"
          class="w-full px-3.5 py-1.5 text-[15px] text-gray-900 placeholder:text-gray-400 focus:outline-none bg-transparent"
          @keypress.enter="handleSubmit"
        />
      </div>
      
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-1.5">
          <Tooltip text="Como vai estar o tempo?" position="bottom">
            <button
              @click="selectClimaTempo"
              :class="[
                'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[14px] transition-all duration-200',
                climaTempo 
                  ? 'bg-orange-50 text-orange-600 border border-orange-300' 
                  : 'bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100'
              ]"
            >
              <Cloudy :size="15" />
              Clima e Tempo
            </button>
          </Tooltip>
          
          
          <Tooltip text="É seguro respirar agora?" position="bottom">
            <button
              @click="selectQualidadeAr"
              :class="[
                'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[14px] transition-all duration-200',
                qualidadeAr 
                  ? 'bg-orange-50 text-orange-600 border border-orange-300' 
                  : 'bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100'
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
              @click="$emit('voice')"
              class="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <MapPin :size="18" />
            </button>
          </Tooltip>

          <Tooltip text="Comando de voz" position="bottom">
            <button
              @click="$emit('voice')"
              class="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <Mic :size="18" />
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
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
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
import { ref } from 'vue'
import { Cloudy, Wind, MapPin,Mic, ArrowUp } from 'lucide-vue-next'
import Tooltip from './Tooltip.vue'

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

const emit = defineEmits(['update:modelValue', 'submit', 'voice'])

const query = ref(props.modelValue)
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

const handleSubmit = () => {
  if (query.value.trim()) {
    emit('submit', {
      query: query.value,
      climaTempo: climaTempo.value,
      qualidadeAr: qualidadeAr.value
    })
    emit('update:modelValue', query.value)
  }
}
</script>
