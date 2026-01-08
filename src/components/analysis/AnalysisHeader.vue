<template>
  <header class="flex flex-col md:flex-row md:items-end justify-between gap-4">
    <div class="space-y-1">
      <h1 class="text-4xl md:text-5xl font-black text-gray-900 dark:text-white tracking-tight">
        {{ geocodingResult?.cidade }}<span class="text-gray-400 dark:text-muted-foreground">.</span>
      </h1>
      <p class="text-gray-500 dark:text-muted-foreground font-medium flex items-center gap-2">
        <MapPin :size="16" class="text-gray-400 dark:text-muted-foreground" />
        {{ geocodingResult?.logradouro || 'Logradouro não identificado' }}, {{ geocodingResult?.bairro || 'Bairro não identificado' }} — {{ geocodingResult?.estado }}
      </p>
    </div>

    <div class="flex items-center gap-3">
      <div class="flex flex-col items-end">
        <span class="text-[10px] font-bold text-gray-400 dark:text-muted-foreground uppercase tracking-widest">Coordenadas</span>
        <span class="text-sm font-mono font-medium text-gray-600 dark:text-muted-foreground">
          {{ geocodingResult?.lat?.toFixed(2) }}, {{ geocodingResult?.lng?.toFixed(2) }}
        </span>
      </div>
      <PDFReportGenerator />
    </div>
  </header>
</template>

<script setup>
import { computed } from 'vue'
import { MapPin } from 'lucide-vue-next'
import { useGlobalStore } from '@/stores/global'
import PDFReportGenerator from './PDFReportGenerator.vue'

const props = defineProps({
  reportContainerRef: {
    type: Object,
    default: null
  }
})

const globalStore = useGlobalStore()

// Dados do store
const geocodingResult = computed(() => globalStore.orchestratorResponse?.geocodingResult)
</script>
