<template>
  <div class="md:col-span-1 lg:col-span-1 relative overflow-hidden bg-white dark:bg-card rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 border border-gray-200 dark:border-border">
    <div class="relative h-full flex flex-col">
      <div class="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6 lg:mb-8">
        <div class="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 bg-gray-100 dark:bg-secondary rounded-xl sm:rounded-2xl flex items-center justify-center border border-gray-100 dark:border-border flex-shrink-0">
          <Flame :size="20" class="sm:w-6 sm:h-6 lg:w-7 lg:h-7 text-gray-700 dark:text-foreground" />
        </div>
        <div class="min-w-0">
          <h3 class="text-sm sm:text-base lg:text-lg font-black tracking-tight text-gray-900 dark:text-white">{{ t('analysis.riskReason') }} <span class="font-black">{{ (globalStore.orchestratorResponse?.fire_risk_result?.weekly_risk_mean * 100).toFixed(0) }}%</span></h3>
          <p class="text-[9px] sm:text-[10px] font-bold text-gray-500 dark:text-muted-foreground uppercase tracking-[0.2em]">{{ t('analysis.riskInterpretation') }}</p>
        </div>
      </div>

      <div class="flex-1 overflow-y-auto pr-2 custom-scrollbar">
        <p class="text-xs sm:text-sm font-medium leading-relaxed text-gray-700 dark:text-muted-foreground">
          {{ ragExplanation || t('analysis.analyzingPatterns') }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { Flame } from 'lucide-vue-next'
import { useGlobalStore } from '@/stores/global'
import { useI18n } from '@/composables/useI18n'

const globalStore = useGlobalStore()
const { t } = useI18n()

// Dados do store
const ragExplanation = computed(() => globalStore.orchestratorResponse?.fire_risk_result?.rag_explanation)
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar { width: 4px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
</style>
