<template>
  <div class="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
    <div 
      v-for="stat in factorStats"
      :key="stat.label"
      class="bg-white dark:bg-card rounded-xl sm:rounded-2xl lg:rounded-3xl p-3 sm:p-4 lg:p-6 border border-gray-200 dark:border-border"
    >
      <div class="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3 lg:mb-4">
        <div :class="`w-8 h-8 sm:w-9 sm:h-9 lg:w-10 lg:h-10 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0 ${stat.bg}`">
          <component :is="stat.icon" :size="14" class="sm:w-4 sm:h-4 lg:w-[18px] lg:h-[18px]" :class="stat.color" />
        </div>
        <span class="text-[9px] sm:text-[10px] font-bold text-gray-400 dark:text-muted-foreground uppercase tracking-widest truncate">{{ stat.label }}</span>
      </div>
      <div class="flex items-baseline gap-1">
        <span class="text-lg sm:text-xl lg:text-2xl font-black text-gray-800 dark:text-white tracking-tight">{{ stat.value }}</span>
        <span class="text-[10px] sm:text-xs font-bold text-gray-400 dark:text-muted-foreground">{{ stat.unit }}</span>
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
const weatherResult = computed(() => globalStore.orchestratorResponse?.weather_result)
const geocodingResult = computed(() => globalStore.orchestratorResponse?.geocoding_result)

// Computed
const preference = computed(() => geocodingResult.value?.preference || 'weather')
const weatherFuture = computed(() => weatherResult.value?.weather_future_7d?.[0]?.daily || {})
const weatherPast = computed(() => weatherResult.value?.weather_past_7d?.[0]?.daily || {})
const airFuture = computed(() => weatherResult.value?.air_future_7d?.[0]?.daily || {})
const airPast = computed(() => weatherResult.value?.air_past_7d?.[0]?.daily || {})

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
