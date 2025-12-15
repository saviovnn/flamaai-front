<template>
  <div class="w-full max-w-3xl">
    <div class="relative bg-white dark:bg-card rounded-3xl border border-gray-200 dark:border-border p-3">
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
          <Tooltip text="Complementar com dados de clima e tempo" position="bottom">
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
          
          
          <Tooltip text="Complementar com dados da qualidade do ar" position="bottom">
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
              @click="$emit('voice')"
              class="p-2 text-gray-400 dark:text-muted-foreground hover:text-gray-600 dark:hover:text-foreground transition-colors"
            >
              <MapPin :size="18" />
            </button>
          </Tooltip>

          <Tooltip text="Comando de voz" position="bottom">
            <button
              @click="$emit('voice')"
              class="p-2 text-gray-400 dark:text-muted-foreground hover:text-gray-600 dark:hover:text-foreground transition-colors"
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
