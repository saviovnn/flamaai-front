<template>
  <div class="lg:col-span-2 bg-white dark:bg-card rounded-2xl sm:rounded-3xl p-8 border border-gray-200 dark:border-border">
    <div class="flex items-center justify-between mb-8">
      <div>
        <h3 class="text-xl font-black text-gray-800 dark:text-white tracking-tight">Evolução do Risco</h3>
        <p class="text-sm font-medium text-gray-500 dark:text-muted-foreground">Projeção para os próximos 7 dias</p>
      </div>
    </div>
    <apexchart type="area" height="300" :options="chartOptions" :series="chartSeries" />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import apexchart from 'vue3-apexcharts'
import { useGlobalStore } from '@/stores/global'

const globalStore = useGlobalStore()

// Dados do store
const fireRiskResult = computed(() => globalStore.orchestratorResponse?.fireRiskResult)

// Risk calculations
const dailyRisks = computed(() => fireRiskResult.value?.dailyRisks || [])

const todayRisk = computed(() => {
  return dailyRisks.value.length > 0 
    ? (dailyRisks.value[0].risk || 0) 
    : (fireRiskResult.value?.weeklyRiskMean || 0)
})

const todayRiskPercent = computed(() => todayRisk.value * 100)

const riskColor = computed(() => {
  const percent = todayRiskPercent.value
  if (percent < 20) return '#10b981'
  if (percent < 40) return '#14b8a6'
  if (percent < 60) return '#f59e0b'
  if (percent < 80) return '#f97316'
  return '#e11d48'
})

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

const chartOptions = computed(() => ({
  ...commonOptions.value,
  colors: [riskColor.value],
  fill: {
    type: 'gradient',
    gradient: { 
      shadeIntensity: 1, 
      opacityFrom: 0.7, 
      opacityTo: 0.05, 
      stops: [0, 60, 100],
      colorStops: [
        { offset: 0, color: riskColor.value, opacity: 0.5 },
        { offset: 50, color: riskColor.value, opacity: 0.3 },
        { offset: 100, color: riskColor.value, opacity: 0.01 }
      ]
    }
  },
  yaxis: { 
    ...commonOptions.value.yaxis, 
    min: 0, 
    max: 100, 
    labels: { 
      ...commonOptions.value.yaxis.labels, 
      formatter: v => `${v}%` 
    } 
  }
}))

const chartSeries = computed(() => [{
  name: 'Risco',
  data: dailyRisks.value.map(d => ({ 
    x: new Date(d.day).getTime(), 
    y: Math.round(d.risk * 100) 
  }))
}])
</script>
