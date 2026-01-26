<template>
  <header class="flex flex-col sm:flex-row sm:items-end justify-between gap-3 sm:gap-4">
    <div class="space-y-1 min-w-0">
      <h1 class="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-gray-900 dark:text-white tracking-tight truncate">
        {{ geocodingResult?.cidade || geocodingResult?.name }}<span class="text-gray-400 dark:text-muted-foreground">.</span>
      </h1>
      <p class="text-xs sm:text-sm text-gray-500 dark:text-muted-foreground font-medium flex items-center gap-1.5 sm:gap-2 flex-wrap">
        <MapPin :size="14" class="sm:w-4 sm:h-4 text-gray-400 dark:text-muted-foreground flex-shrink-0" />
        <span class="truncate">{{ geocodingResult?.publicPlace || geocodingResult?.logradouro || 'Logradouro não identificado' }}, {{ geocodingResult?.neighborhood || geocodingResult?.bairro || 'Bairro não identificado' }} — {{ geocodingResult?.state || geocodingResult?.estado }}</span>
      </p>
    </div>

    <div class="flex items-center gap-2 sm:gap-3 flex-shrink-0">
      <div class="flex flex-col items-end">
        <span class="text-[9px] sm:text-[10px] font-bold text-gray-400 dark:text-muted-foreground uppercase tracking-widest">Coordenadas</span>
        <span class="text-xs sm:text-sm font-mono font-medium text-gray-600 dark:text-muted-foreground">
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
const geocodingResult = computed(() => globalStore.orchestratorResponse?.geocoding_result)
</script>
