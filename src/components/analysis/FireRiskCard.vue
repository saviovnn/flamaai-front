<template>
  <div
    class="lg:col-span-8 relative overflow-hidden rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 border bg-white dark:bg-card border-gray-200 dark:border-border"
  >
    <div class="absolute inset-x-0 top-0 h-1.5"></div>

    <div class="relative">
      <div class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4">
        <div>
          <div class="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 dark:text-muted-foreground">
            <Activity :size="14" class="text-gray-400 dark:text-muted-foreground" />
            {{ t('analysis.fireRisk') }}
          </div>
          <h2 class="text-xl sm:text-2xl lg:text-3xl font-black mt-2 tracking-tight">
            {{ t('analysis.weeklyMean') }}: <span :class="riskTone.labelText">{{ weeklyRiskLabel }}</span>
          </h2>
          <p class="text-xs sm:text-sm text-gray-600 dark:text-muted-foreground font-medium mt-1">
            {{ dateLabel }}: <span class="font-black">{{ todayRiskPercent.toFixed(0) }}%</span> • {{ t('analysis.level') }}
            <span class="font-black">{{ todayRiskLabel }}</span>
          </p>
        </div>

        <div class="flex items-center gap-2 sm:gap-3">
          <div class="px-2 sm:px-3 py-1 sm:py-1.5 rounded-full border text-[9px] sm:text-[10px] font-black uppercase tracking-widest"
               :class="riskTone.badge">
            {{ riskTone.badgeText }}
          </div>
          <div class="w-9 h-9 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl flex items-center justify-center border bg-gray-50 dark:bg-secondary border-gray-100 dark:border-border">
            <Flame :size="18" class="sm:w-[22px] sm:h-[22px]" :class="riskTone.iconText" />
          </div>
        </div>
      </div>

      <div class="mt-4 sm:mt-6 flex items-end gap-2">
        <span class="text-5xl sm:text-7xl lg:text-8xl font-black tracking-tighter leading-none text-gray-900 dark:text-white">{{ weeklyRiskPercent.toFixed(0) }}</span>
        <span class="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-400 dark:text-muted-foreground mb-1 sm:mb-2">%</span>
      </div>

      <div class="mt-4 sm:mt-6 space-y-3 sm:space-y-4">
        <div class="w-full h-2 sm:h-3 bg-gray-100 dark:bg-accent rounded-full overflow-hidden">
          <div
            class="h-full rounded-full"
            :class="riskTone.fill"
            :style="{ width: `${Math.min(100, Math.max(0, weeklyRiskPercent))}%` }"
          ></div>
        </div>

        <div class="flex gap-1.5 sm:gap-2 overflow-x-auto pb-2 sm:pb-0 -mx-1 px-1 sm:mx-0 sm:px-0 sm:grid sm:grid-cols-7 scrollbar-hide">
          <div
            v-for="(d, idx) in dailyRisksSliced"
            :key="idx"
            class="flex-shrink-0 w-[4.5rem] sm:w-auto bg-gray-50 dark:bg-secondary border border-gray-200 dark:border-border rounded-xl sm:rounded-2xl p-1.5 sm:p-2"
          >
            <div class="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-gray-500 dark:text-muted-foreground">
              {{ formatDayShort(d.day) }}
            </div>
            <div class="mt-1.5 sm:mt-2 h-1.5 sm:h-2 rounded-full bg-gray-200/70 dark:bg-accent overflow-hidden">
              <div class="h-1.5 sm:h-2 rounded-full" :class="toneForRisk(d.risk).fill" :style="{ width: `${Math.round((d.risk || 0) * 100)}%` }"></div>
            </div>
            <div class="mt-1.5 sm:mt-2 text-[11px] sm:text-xs font-black text-gray-800 dark:text-foreground">
              {{ Math.round((d.risk || 0) * 100) }}%
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { Activity, Flame } from 'lucide-vue-next'
import { useGlobalStore } from '@/stores/global'
import { useI18n } from '@/composables/useI18n'
import { parseDateLocal } from '@/lib/utils'

const globalStore = useGlobalStore()
const { t } = useI18n()

const fireRiskResult = computed(() => globalStore.orchestratorResponse?.fire_risk_result)

const dateLabel = computed(() => {
  const entry = displayDayEntry.value
  if (!entry?.day) return t('analysis.today')

  const dayIso = entry.day
  if (dayIso === todayIso.value) return t('analysis.today')

  const localeMap = { pt: 'pt-BR', en: 'en-US', es: 'es-ES' }
  const locale = localeMap[globalStore.locale] || 'en-US'
  const d = parseDateLocal(dayIso)
  return d.toLocaleDateString(locale, {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  })
})

const dailyRisks = computed(() => fireRiskResult.value?.daily_risks || [])
const dailyRisksSliced = computed(() => dailyRisks.value.slice(0, 7))

const todayIso = computed(() => {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
})

const displayDayEntry = computed(() => {
  const slice = dailyRisksSliced.value
  if (!slice.length) return null
  const today = dailyRisksSliced.value.find((d) => d.day === todayIso.value)
  return today ?? slice[0]
})

const todayRisk = computed(() => {
  if (displayDayEntry.value != null) return displayDayEntry.value.risk ?? 0
  return fireRiskResult.value?.weekly_risk_mean ?? 0
})

const todayRiskPercent = computed(() => todayRisk.value * 100)

const weeklyRiskMean = computed(() => fireRiskResult.value?.weekly_risk_mean ?? 0)
const weeklyRiskPercent = computed(() => weeklyRiskMean.value * 100)

const todayRiskLabel = computed(() => {
  const p = todayRiskPercent.value
  if (p < 20) return t('analysis.riskMin')
  if (p < 40) return t('analysis.riskLow')
  if (p < 60) return t('analysis.riskModerate')
  if (p < 80) return t('analysis.riskHigh')
  return t('analysis.riskExtreme')
})

const weeklyRiskLabel = computed(() => {
  const level = fireRiskResult.value?.risk_level
  const labels = { 
    baixo: t('analysis.weeklyBaixo'), 
    regular: t('analysis.weeklyRegular'), 
    medio: t('analysis.weeklyMedio'), 
    alto: t('analysis.weeklyAlto'), 
    critico: t('analysis.weeklyCritico') 
  }
  return labels[level] || '—'
})

const toneForPercent = (percent) => {
  if (percent < 20) {
    return {
      topBar: 'bg-emerald-500',
      labelText: 'text-emerald-600 dark:text-emerald-400',
      iconText: 'text-emerald-600 dark:text-emerald-400',
      badge: 'bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-300 dark:border-emerald-900/40',
      badgeText: t('analysis.riskBadgeMin'),
      fill: 'bg-emerald-500',
      chart: '#10b981'
    }
  }
  if (percent < 40) {
    return {
      topBar: 'bg-teal-500',
      labelText: 'text-teal-700 dark:text-teal-300',
      iconText: 'text-teal-700 dark:text-teal-300',
      badge: 'bg-teal-50 text-teal-700 border-teal-100 dark:bg-teal-900/20 dark:text-teal-200 dark:border-teal-900/40',
      badgeText: t('analysis.riskBadgeLow'),
      fill: 'bg-teal-500',
      chart: '#14b8a6'
    }
  }
  if (percent < 60) {
    return {
      topBar: 'bg-amber-500',
      labelText: 'text-amber-700 dark:text-amber-300',
      iconText: 'text-amber-700 dark:text-amber-300',
      badge: 'bg-amber-50 text-amber-800 border-amber-100 dark:bg-amber-900/20 dark:text-amber-200 dark:border-amber-900/40',
      badgeText: t('analysis.riskBadgeModerate'),
      fill: 'bg-amber-500',
      chart: '#f59e0b'
    }
  }
  if (percent < 80) {
    return {
      topBar: 'bg-orange-500',
      labelText: 'text-orange-700 dark:text-orange-300',
      iconText: 'text-orange-700 dark:text-orange-300',
      badge: 'bg-orange-50 text-orange-800 border-orange-100 dark:bg-orange-900/20 dark:text-orange-200 dark:border-orange-900/40',
      badgeText: t('analysis.riskBadgeHigh'),
      fill: 'bg-orange-500',
      chart: '#f97316'
    }
  }
  return {
    topBar: 'bg-rose-600',
    labelText: 'text-rose-700 dark:text-rose-500',
    iconText: 'text-rose-700 dark:text-rose-500',
    badge: 'bg-rose-50 text-rose-800 border-rose-100 dark:bg-rose-900/20 dark:text-rose-200 dark:border-rose-900/40',
    badgeText: t('analysis.riskBadgeExtreme'),
    fill: 'bg-rose-600',
    chart: '#e11d48'
  }
}

const riskTone = computed(() => {
  globalStore.locale 
  return toneForPercent(weeklyRiskPercent.value)
})
const toneForRisk = (risk) => toneForPercent((risk || 0) * 100)

const formatDayShort = (iso) => {
  try {
    const localeMap = { pt: 'pt-BR', en: 'en-US', es: 'es-ES' }
    const locale = localeMap[globalStore.locale] || 'en-US'
    return parseDateLocal(iso).toLocaleDateString(locale, { weekday: 'short' }).replace('.', '')
  } catch {
    return '—'
  }
}
</script>

<style scoped>
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}

.scrollbar-hide {
  -ms-overflow-style: none;  
  scrollbar-width: none;  
}
</style>
