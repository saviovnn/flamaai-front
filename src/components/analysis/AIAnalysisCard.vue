<template>
  <div class="relative overflow-hidden bg-white dark:bg-card rounded-2xl sm:rounded-3xl p-8 border border-gray-200 dark:border-border">
    <div class="relative h-full flex flex-col">
      <div class="flex items-center gap-4 mb-8">
        <div class="w-14 h-14 bg-gray-100 dark:bg-secondary rounded-2xl flex items-center justify-center border border-gray-100 dark:border-border">
          <Flame :size="28" class="text-gray-700 dark:text-foreground" />
        </div>
        <div>
          <h3 class="text-lg font-black tracking-tight text-gray-900 dark:text-white">Motivo do Risco de <span class="font-black">{{ (globalStore.orchestratorResponse?.fireRiskResult?.weeklyRiskMean * 100).toFixed(0) }}%</span></h3>
          <p class="text-[10px] font-bold text-gray-500 dark:text-muted-foreground uppercase tracking-[0.2em]">Interpretação do risco de fogo</p>
        </div>
      </div>

      <div class="flex-1 overflow-y-auto pr-2 custom-scrollbar">
        <p class="text-sm font-medium leading-relaxed text-gray-700 dark:text-muted-foreground">
          {{ ragExplanation || 'Analisando padrões climáticos complexos e variáveis de terreno para fornecer uma explicação contextualizada do risco de fogo...' }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { Flame } from 'lucide-vue-next'
import { useGlobalStore } from '@/stores/global'

const globalStore = useGlobalStore()

// Dados do store
const ragExplanation = computed(() => globalStore.orchestratorResponse?.fireRiskResult?.ragExplanation)
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar { width: 4px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
</style>
