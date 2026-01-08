<template>
  <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
    <div 
      v-for="stat in factorStats"
      :key="stat.label"
      class="bg-white dark:bg-card rounded-2xl sm:rounded-3xl p-6 border border-gray-200 dark:border-border"
    >
      <div class="flex items-center gap-3 mb-4">
        <div :class="`w-10 h-10 rounded-xl flex items-center justify-center ${stat.bg}`">
          <component :is="stat.icon" :size="18" :class="stat.color" />
        </div>
        <span class="text-[10px] font-bold text-gray-400 dark:text-muted-foreground uppercase tracking-widest">{{ stat.label }}</span>
      </div>
      <div class="flex items-baseline gap-1">
        <span class="text-2xl font-black text-gray-800 dark:text-white tracking-tight">{{ stat.value }}</span>
        <span class="text-xs font-bold text-gray-400 dark:text-muted-foreground">{{ stat.unit }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { 
  Thermometer, Droplet, Wind, Activity, 
  Sparkles, Sun, Leaf
} from 'lucide-vue-next'
import { useGlobalStore } from '@/stores/global'

const globalStore = useGlobalStore()

// Dados do store
const weatherResult = computed(() => globalStore.orchestratorResponse?.weatherResult)
const geocodingResult = computed(() => globalStore.orchestratorResponse?.geocodingResult)

// Computed
const preference = computed(() => geocodingResult.value?.preference || 'weather')
const weatherFuture = computed(() => weatherResult.value?.weatherFuture_7d?.[0]?.daily || {})
const weatherPast = computed(() => weatherResult.value?.weatherPast_7d?.[0]?.daily || {})
const airFuture = computed(() => weatherResult.value?.airFuture_7d?.[0]?.daily || {})
const airPast = computed(() => weatherResult.value?.airPast_7d?.[0]?.daily || {})

const safeLast = (arr) => (Array.isArray(arr) && arr.length ? arr[arr.length - 1] : null)

// Weather stats
const currentTempMax = computed(() => {
  const v = weatherFuture.value.temperature_2m_max?.[0]
  return typeof v === 'number' ? v : safeLast(weatherPast.value.temperature_2m_max)
})

const currentHumidity = computed(() => {
  const v = weatherFuture.value.relative_humidity_2m_mean?.[0]
  return typeof v === 'number' ? v : safeLast(weatherPast.value.relative_humidity_2m_mean)
})

const currentWindMax = computed(() => {
  const v = weatherFuture.value.windspeed_10m_max?.[0]
  return typeof v === 'number' ? v : safeLast(weatherPast.value.windspeed_10m_max)
})

const currentUvMax = computed(() => {
  const v = weatherFuture.value.uv_index_max?.[0]
  return typeof v === 'number' ? v : safeLast(weatherPast.value.uv_index_max)
})

// Air stats
const currentPM25 = computed(() => {
  const v = airFuture.value.pm2_5?.[0]
  return v === null || v === undefined ? safeLast(airPast.value.pm2_5) : v
})

const currentPM10 = computed(() => {
  const v = airFuture.value.pm10?.[0]
  return v === null || v === undefined ? safeLast(airPast.value.pm10) : v
})

const currentNO2 = computed(() => {
  const v = airFuture.value.nitrogen_dioxide?.[0]
  return v === null || v === undefined ? safeLast(airPast.value.nitrogen_dioxide) : v
})

const currentO3 = computed(() => {
  const v = airFuture.value.ozone?.[0]
  return v === null || v === undefined ? safeLast(airPast.value.ozone) : v
})

const factorStats = computed(() => {
  if (preference.value === 'air') {
    return [
      { label: 'PM2.5', value: (currentPM25.value ?? 0).toFixed(1), unit: 'μg/m³', icon: Activity, bg: 'bg-emerald-50 dark:bg-emerald-900/20', color: 'text-emerald-500' },
      { label: 'PM10', value: (currentPM10.value ?? 0).toFixed(1), unit: 'μg/m³', icon: Wind, bg: 'bg-gray-100 dark:bg-secondary', color: 'text-gray-500 dark:text-muted-foreground' },
      { label: 'NO₂', value: (currentNO2.value ?? 0).toFixed(1), unit: 'μg/m³', icon: Leaf, bg: 'bg-amber-50 dark:bg-amber-900/20', color: 'text-amber-500' },
      { label: 'O₃', value: (currentO3.value ?? 0).toFixed(1), unit: 'μg/m³', icon: Sparkles, bg: 'bg-violet-50 dark:bg-violet-900/20', color: 'text-violet-500' }
    ]
  }

  return [
    { label: 'Temperatura', value: (currentTempMax.value ?? 0).toFixed(1), unit: '°C', icon: Thermometer, bg: 'bg-orange-50 dark:bg-orange-900/20', color: 'text-orange-500' },
    { label: 'Umidade', value: (currentHumidity.value ?? 0).toFixed(0), unit: '%', icon: Droplet, bg: 'bg-blue-50 dark:bg-blue-900/20', color: 'text-blue-500' },
    { label: 'Vento Máx', value: (currentWindMax.value ?? 0).toFixed(1), unit: 'km/h', icon: Wind, bg: 'bg-gray-50 dark:bg-secondary', color: 'text-gray-500 dark:text-muted-foreground' },
    { label: 'UV Máximo', value: (currentUvMax.value ?? 0).toFixed(1), unit: 'índice', icon: Sun, bg: 'bg-amber-50 dark:bg-amber-900/20', color: 'text-amber-500' }
  ]
})
</script>
