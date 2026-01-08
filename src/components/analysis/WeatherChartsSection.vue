<template>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
    <!-- Card 1: Qualidade do Ar / Histórico Climático -->
    <div class="bg-white dark:bg-card rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 border border-gray-200 dark:border-border">
      <div class="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6 lg:mb-8">
        <div
          class="w-10 h-10 sm:w-11 sm:h-11 lg:w-12 lg:h-12 rounded-xl sm:rounded-2xl flex items-center justify-center flex-shrink-0"
          :class="preference === 'air' ? 'bg-emerald-100 dark:bg-emerald-900/30' : 'bg-amber-100 dark:bg-amber-900/30'"
        >
          <component :is="preference === 'air' ? Wind : Sun" :size="18" class="sm:w-5 sm:h-5 lg:w-6 lg:h-6" :class="preference === 'air' ? 'text-emerald-500' : ' text-amber-500'" />
        </div>
        <div class="min-w-0">
          <h3 class="text-base sm:text-lg font-black text-gray-800 dark:text-white tracking-tight">
            {{ preference === 'air' ? 'Qualidade do Ar' : 'Histórico Climático' }}
          </h3>
          <div v-if="preference === 'air'" class="flex items-center gap-1.5 sm:gap-2">
            <span class="text-[11px] sm:text-xs font-bold" :class="aqiColorClass">AQI {{ aqiValue }}</span>
            <span class="text-[9px] sm:text-[10px] text-gray-400 dark:text-muted-foreground font-bold uppercase tracking-widest">{{ aqiLabel }}</span>
          </div>
          <p v-else class="text-[10px] sm:text-xs font-bold text-gray-400 dark:text-muted-foreground uppercase tracking-widest">Passado e Previsão</p>
        </div>
      </div>

      <apexchart
        type="line"
        :height="chartHeight"
        :options="preference === 'air' ? refinedAirChartOptions : refinedWeatherHistoryOptions"
        :series="preference === 'air' ? airQualityChartSeries : weatherHistorySeries"
      />
      
    </div>

    <!-- Card 2: Tendência de Partículas / Chuva -->
    <div class="bg-white dark:bg-card rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 border border-gray-200 dark:border-border">
      <div class="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6 lg:mb-8">
        <div
          class="w-10 h-10 sm:w-11 sm:h-11 lg:w-12 lg:h-12 rounded-xl sm:rounded-2xl flex items-center justify-center flex-shrink-0"
          :class="preference === 'air' ? 'bg-violet-100 dark:bg-violet-900/30' : 'bg-blue-50 dark:bg-blue-900/20'"
        >
          <component :is="preference === 'air' ? Activity : CloudRain" :size="18" class="sm:w-5 sm:h-5 lg:w-6 lg:h-6" :class="preference === 'air' ? 'text-violet-500' : 'text-blue-500'" />
        </div>
        <div class="min-w-0">
          <h3 class="text-base sm:text-lg font-black text-gray-800 dark:text-white tracking-tight">
            {{ preference === 'air' ? 'Tendência de Partículas' : 'Chuva (próximos dias)' }}
          </h3> 
          <p class="text-[10px] sm:text-xs font-bold text-gray-400 dark:text-muted-foreground uppercase tracking-widest">
            {{ preference === 'air' ? 'PM2.5 / PM10' : 'Acumulado diário' }}
          </p>
        </div>
      </div>

      <apexchart
        :type="preference === 'air' ? 'area' : 'bar'"
        :height="chartHeight"
        :options="preference === 'air' ? refinedAirTrendOptions : refinedPrecipOptions"
        :series="preference === 'air' ? airTrendSeries : precipSeries"
      />
    </div>
  </div>
</template>

<script setup>
import { computed, ref, onMounted, onUnmounted } from 'vue'
import apexchart from 'vue3-apexcharts'
import { CloudRain, Wind, Activity, Sun } from 'lucide-vue-next'
import { useGlobalStore } from '@/stores/global'

const globalStore = useGlobalStore()

// Responsive chart height
const windowWidth = ref(typeof window !== 'undefined' ? window.innerWidth : 1024)

const chartHeight = computed(() => {
  if (windowWidth.value < 640) return 180
  if (windowWidth.value < 1024) return 210
  return 240
})

let resizeHandler = null
onMounted(() => {
  resizeHandler = () => { windowWidth.value = window.innerWidth }
  window.addEventListener('resize', resizeHandler)
})
onUnmounted(() => {
  if (resizeHandler) window.removeEventListener('resize', resizeHandler)
})

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

// AQI Logic
const currentPM25 = computed(() => {
  const v = airFuture.value.pm2_5?.[0]
  return v === null || v === undefined ? safeLast(airPast.value.pm2_5) : v
})

const aqiValue = computed(() => {
  const pm25 = (currentPM25.value ?? 0)
  if (pm25 <= 12) return Math.round((pm25 / 12) * 50)
  if (pm25 <= 35.4) return Math.round(50 + ((pm25 - 12) / 23.4) * 50)
  return 100
})

const aqiLabel = computed(() => {
  const v = aqiValue.value
  if (v <= 50) return 'Excelente'
  if (v <= 100) return 'Regular'
  return 'Preocupante'
})

const aqiColorClass = computed(() => {
  const v = aqiValue.value
  if (v <= 50) return 'text-emerald-500'
  if (v <= 100) return 'text-amber-500'
  return 'text-rose-500'
})

// Chart Options
const commonOptions = computed(() => ({
  chart: { toolbar: { show: false }, zoom: { enabled: false }, fontFamily: 'Inter, sans-serif' },
  grid: { borderColor: globalStore.isDark ? '#1e293b' : '#f1f5f9', strokeDashArray: 4 },
  xaxis: { 
    type: 'datetime',
    labels: { style: { colors: globalStore.isDark ? '#94a3b8' : '#64748b', fontSize: '10px', fontWeight: 700 } },
    axisBorder: { show: false }, axisTicks: { show: false }
  },
  yaxis: { labels: { style: { colors: globalStore.isDark ? '#94a3b8' : '#64748b', fontSize: '10px', fontWeight: 700 } } },
  legend: { show: false },
  stroke: { curve: 'smooth', width: 3 },
  tooltip: { theme: globalStore.isDark ? 'dark' : 'light' }
}))

const refinedAirChartOptions = computed(() => ({
  ...commonOptions.value,
  colors: ['#10b981', '#06b6d4'],
  stroke: { curve: 'smooth', width: 2 },
  legend: { show: true }
}))

const zipTimeSeriesFiltered = (times, values) => {
  const out = []
  const n = Math.min(times?.length || 0, values?.length || 0)
  for (let i = 0; i < n; i++) {
    const t = times[i]
    const v = values[i]
    // Pula valores null ou undefined
    if (!t || v === null || v === undefined || typeof v !== 'number') continue
    const x = new Date(t).getTime()
    if (!Number.isFinite(x)) continue
    out.push({ x, y: v })
  }
  return out
}

const airQualityChartSeries = computed(() => {
  const pastTimes = airPast.value.time || []
  const futureTimes = airFuture.value.time || []
  const pastPm25 = airPast.value.pm2_5 || []
  const pastPm10 = airPast.value.pm10 || []
  const futurePm25 = airFuture.value.pm2_5 || []
  const futurePm10 = airFuture.value.pm10 || []
  
  // Combina passado e futuro, filtrando nulls
  const pm25Past = zipTimeSeriesFiltered(pastTimes, pastPm25)
  const pm25Future = zipTimeSeriesFiltered(futureTimes, futurePm25)
  const pm10Past = zipTimeSeriesFiltered(pastTimes, pastPm10)
  const pm10Future = zipTimeSeriesFiltered(futureTimes, futurePm10)
  
  const pm25 = [...pm25Past, ...pm25Future].slice(-10)
  const pm10 = [...pm10Past, ...pm10Future].slice(-10)
  
  return [{ name: 'PM2.5', data: pm25 }, { name: 'PM10', data: pm10 }]
})

const refinedAirTrendOptions = computed(() => ({
  ...commonOptions.value,
  colors: ['#8b5cf6'],
  fill: {
    type: 'gradient',
    gradient: { 
      shadeIntensity: 1, 
      opacityFrom: 0.7, 
      opacityTo: 0.05, 
      stops: [0, 60, 100],
      colorStops: [
        { offset: 0, color: '#8b5cf6', opacity: 0.5 },
        { offset: 50, color: '#8b5cf6', opacity: 0.3 },
        { offset: 100, color: '#8b5cf6', opacity: 0.01 }
      ]
    }
  },
  stroke: { curve: 'smooth', width: 2.5 }
}))

const airTrendSeries = computed(() => {
  const times = airFuture.value.time || []
  const pm25 = airFuture.value.pm2_5 || []
  
  // Filtra apenas valores válidos (não null)
  const data = []
  for (let i = 0; i < Math.min(times.length, pm25.length, 7); i++) {
    const t = times[i]
    const v = pm25[i]
    if (t && v !== null && v !== undefined && typeof v === 'number') {
      data.push({ x: new Date(t).getTime(), y: v })
    }
  }
  
  return [{ name: 'PM2.5', data }]
})

const refinedWeatherHistoryOptions = computed(() => ({
  chart: { 
    toolbar: { show: false }, 
    zoom: { enabled: false }, 
    fontFamily: 'Inter, sans-serif',
    type: 'line'
  },
  colors: ['#f97316', '#64748b', '#10b981'],
  stroke: { 
    curve: 'smooth', 
    width: [3, 3, 3]
  },
  markers: {
    size: 4,
    strokeWidth: 0,
    hover: { size: 6 }
  },
  grid: { 
    borderColor: globalStore.isDark ? '#1e293b' : '#f1f5f9', 
    strokeDashArray: 4 
  },
  legend: { 
    show: true,
    labels: { colors: globalStore.isDark ? '#94a3b8' : '#64748b' }
  },
  xaxis: {
    type: 'datetime',
    labels: { 
      style: { colors: globalStore.isDark ? '#94a3b8' : '#64748b', fontSize: '10px', fontWeight: 700 },
      datetimeFormatter: {
        day: 'dd MMM'
      }
    },
    axisBorder: { show: false }, 
    axisTicks: { show: false }
  },
  yaxis: { 
    labels: { 
      style: { colors: globalStore.isDark ? '#94a3b8' : '#64748b', fontSize: '10px', fontWeight: 700 } 
    } 
  },
  tooltip: { 
    theme: globalStore.isDark ? 'dark' : 'light',
    x: { format: 'dd MMM yyyy' }
  }
}))

const weatherHistorySeries = computed(() => {
  const future = weatherFuture.value
  const past = weatherPast.value
  
  const pastTimes = past?.time || []
  const futureTimes = future?.time || []
  
  // Helper para pegar array de forma segura
  const getArray = (obj, ...keys) => {
    for (const key of keys) {
      const arr = obj?.[key]
      if (Array.isArray(arr) && arr.length > 0) return arr
    }
    return []
  }
  
  // Helper para criar série de dados com timestamps
  const createTimeSeries = (pTimes, pValues, fTimes, fValues) => {
    const dataMap = new Map()
    
    // Adiciona dados do passado
    if (Array.isArray(pTimes) && Array.isArray(pValues)) {
      pTimes.forEach((t, i) => {
        const v = pValues[i]
        if (t && v !== null && v !== undefined && typeof v === 'number') {
          dataMap.set(t, v)
        }
      })
    }
    
    // Adiciona/sobrescreve com dados do futuro
    if (Array.isArray(fTimes) && Array.isArray(fValues)) {
      fTimes.forEach((t, i) => {
        const v = fValues[i]
        if (t && v !== null && v !== undefined && typeof v === 'number') {
          dataMap.set(t, v)
        }
      })
    }
    
    // Converte para array ordenado por data
    const result = Array.from(dataMap.entries())
      .sort((a, b) => new Date(a[0]).getTime() - new Date(b[0]).getTime())
      .slice(-14)
      .map(([t, v]) => ({ x: new Date(t).getTime(), y: Number(v.toFixed(1)) }))
    
    return result
  }
  
  const pastTempArr = getArray(past, 'temperature_2m_mean', 'temperature_2m_max')
  const futureTempArr = getArray(future, 'temperature_2m_mean', 'temperature_2m_max')
  const pastWindArr = getArray(past, 'windspeed_10m_max')
  const futureWindArr = getArray(future, 'windspeed_10m_max')
  const pastHumArr = getArray(past, 'relative_humidity_2m_mean')
  const futureHumArr = getArray(future, 'relative_humidity_2m_mean')
  
  const temps = createTimeSeries(pastTimes, pastTempArr, futureTimes, futureTempArr)
  const winds = createTimeSeries(pastTimes, pastWindArr, futureTimes, futureWindArr)
  const hums = createTimeSeries(pastTimes, pastHumArr, futureTimes, futureHumArr)
  
  return [
    { name: 'Temp (°C)', data: temps },
    { name: 'Vento (km/h)', data: winds },
    { name: 'Umidade (%)', data: hums }
  ]
})

const refinedPrecipOptions = computed(() => ({
  ...commonOptions.value,
  colors: ['#159cfa'],
  plotOptions: { 
    bar: { 
      borderRadius: 12, 
      columnWidth: '55%',
      dataLabels: {
        position: 'top'
      }
    } 
  },
  fill: { type: 'solid', opacity: 1 },
  stroke: { show: false },
  dataLabels: {
    enabled: true,
    formatter: (val) => val > 0 ? val : '0',
    style: {
      fontSize: '11px',
      fontWeight: 700,
      colors: [globalStore.isDark ? '#e2e8f0' : '#334155']
    },
    offsetY: -20
  },
  yaxis: { 
    ...commonOptions.value.yaxis, 
    min: 0,
    labels: { ...commonOptions.value.yaxis.labels, formatter: v => `${v}mm` } 
  }
}))

const precipSeries = computed(() => {
  const times = weatherFuture.value.time || []
  const prec = weatherFuture.value.precipitation_sum || []
  
  // Inclui todos os valores (mesmo 0), apenas filtra null/undefined
  const data = []
  for (let i = 0; i < Math.min(times.length, prec.length, 7); i++) {
    const t = times[i]
    const v = prec[i]
    if (t && v !== null && v !== undefined && typeof v === 'number') {
      data.push({ x: new Date(t).getTime(), y: v })
    }
  }
  
  return [{ name: 'Chuva (mm)', data }]
})
</script>
