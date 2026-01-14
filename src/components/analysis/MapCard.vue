<template>
  <div class="lg:col-span-4 bg-white dark:bg-card rounded-2xl sm:rounded-3xl p-4 sm:p-5 lg:p-6 border border-gray-200 dark:border-border">
    <div class="flex items-start justify-between gap-2 sm:gap-3">
      <div>
        <div class="text-[9px] sm:text-[10px] font-black text-gray-400 dark:text-muted-foreground uppercase tracking-widest">Mapa</div>
        <h3 class="text-base sm:text-lg font-black text-gray-800 dark:text-white tracking-tight mt-1">Área analisada</h3>
        <p class="text-[11px] sm:text-xs font-medium text-gray-500 dark:text-muted-foreground mt-1">
          {{ geocodingResult?.bioma }} • IBGE {{ geocodingResult?.ibge_id }}
        </p>
      </div>
      <div class="text-right flex-shrink-0">
        <div class="text-[9px] sm:text-[10px] font-black text-gray-400 dark:text-muted-foreground uppercase tracking-widest">Preferência</div>
        <button
          @click="togglePreference"
          class="mt-1 inline-flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full bg-gray-100 dark:bg-secondary text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-gray-600 dark:text-muted-foreground hover:bg-gray-200 dark:hover:bg-secondary/80 transition-all cursor-pointer active:scale-95"
        >
          <span class="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full transition-colors" :class="preference === 'air' ? 'bg-blue-500' : 'bg-emerald-500'"></span>
          {{ preference === 'air' ? 'AR' : 'CLIMA' }}
        </button>
      </div>
    </div>

    <div class="mt-3 sm:mt-4 lg:mt-5 rounded-xl sm:rounded-2xl overflow-hidden border border-gray-100 dark:border-border bg-gray-100 dark:bg-secondary relative">
      <div id="map" class="w-full h-[200px] sm:h-[230px] lg:h-[260px]"></div>
      
      <!-- Info button with credits tooltip -->
      <div class="absolute bottom-3 right-3 z-[1000] group">
        <div class="w-6 h-6 rounded-full bg-white/90 dark:bg-card/90 backdrop-blur-sm border border-gray-200 dark:border-border flex items-center justify-center cursor-help shadow-sm hover:shadow-md">
          <svg class="w-3.5 h-3.5 text-gray-500 dark:text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        
        <!-- Tooltip -->
        <div class="absolute bottom-full right-0 mb-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible pointer-events-none">
          <div class="bg-white dark:bg-card text-gray-800 dark:text-white text-[10px] font-medium px-3 py-2 rounded-lg shadow-xl border border-gray-200 dark:border-border whitespace-nowrap">
            <div class="text-gray-400 dark:text-muted-foreground uppercase tracking-wider mb-1">Créditos</div>
            <div>© Stadia Maps</div>
            <div>© OpenMapTiles</div>
            <div>© OpenStreetMap</div>
            <div class="mt-1.5 pt-1.5 border-t border-gray-200 dark:border-border">
              <span class="text-gray-400 dark:text-muted-foreground">Tema:</span> {{ globalStore.isDark ? 'Alidade Smooth Dark' : 'Alidade Smooth' }}
            </div>
          </div>
          <div class="absolute -bottom-1 right-2 w-2 h-2 bg-white dark:bg-card border-r border-b border-gray-200 dark:border-border rotate-45"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, onUnmounted, watch, nextTick } from 'vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { useGlobalStore } from '@/stores/global'

const globalStore = useGlobalStore()
let map = null

const geocodingResult = computed(() => globalStore.orchestratorResponse?.geocoding_result)
const mapResult = computed(() => globalStore.orchestratorResponse?.map_result)
const fireRiskResult = computed(() => globalStore.orchestratorResponse?.fire_risk_result)

const preference = computed(() => geocodingResult.value?.preference || 'weather')
const lat = computed(() => geocodingResult.value?.lat)
const lng = computed(() => geocodingResult.value?.lng)
const mapGeometry = computed(() => mapResult.value?.map)

const todayRisk = computed(() => {
  const risks = fireRiskResult.value?.daily_risks || []
  return risks.length > 0 
    ? (risks[0].risk || 0) 
    : (fireRiskResult.value?.weekly_risk_mean || 0)
})

const todayRiskPercent = computed(() => todayRisk.value * 100)

const riskColor = computed(() => {
  const percent = todayRiskPercent.value
  if (percent < 20) return '#10b981'
  if (percent < 40) return '#14b8a6'
  if (percent < 80) return '#f59e0b'
  if (percent < 80) return '#f97316'
  return '#e11d48'
})

const riskColorBorder = computed(() => {
  const percent = todayRiskPercent.value
  if (percent < 20) return darkenColor(riskColor.value, 50)
  if (percent < 40) return darkenColor(riskColor.value, 60)
  if (percent < 80) return darkenColor(riskColor.value, 35)
  if (percent < 80) return darkenColor(riskColor.value, 60)
  return darkenColor(riskColor.value, 50)
})

const darkenColor = (hex, percent) => {
  const num = parseInt(hex.replace('#', ''), 16)
  const amt = Math.round(2.55 * percent)
  const R = Math.max(0, (num >> 16) - amt)
  const G = Math.max(0, ((num >> 8) & 0x00FF) - amt)
  const B = Math.max(0, (num & 0x0000FF) - amt)
  return `#${(1 << 24 | R << 16 | G << 8 | B).toString(16).slice(1)}`
}

const togglePreference = () => {
  if (globalStore.orchestratorResponse?.geocoding_result) {
    const currentPref = preference.value
    const newPref = currentPref === 'air' ? 'weather' : 'air'
    
    globalStore.orchestratorResponse.geocoding_result.preference = newPref
  }
}

const initMap = () => {
  const target = document.getElementById('map')
  if (!target || !lat.value || !lng.value) return
  
  if (map) map.remove()

  map = L.map('map', { 
    center: [lat.value, lng.value], 
    zoom: 12, 
    zoomControl: false, 
    attributionControl: false 
  })

  const tileUrl = globalStore.isDark 
    ? 'https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png'
    : 'https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png'
  
  L.tileLayer(tileUrl, { 
    maxZoom: 20,
    attribution: '© Stadia Maps, © OpenMapTiles, © OpenStreetMap'
  }).addTo(map)

  const borderColor = riskColorBorder.value

  const marker = L.divIcon({
    className: '',
    html: `<div class="relative flex items-center justify-center">
            <div class="pulse-ring absolute w-12 h-12 rounded-full" style="background-color: ${borderColor}CC;"></div>
            <div class="pulse-dot w-4 h-4 rounded-full shadow-2xl" style="background-color: ${riskColor.value}40; border: 4px solid ${riskColor.value};"></div>
          </div>`,
    iconSize: [24, 24]
  })
  L.marker([lat.value, lng.value], { icon: marker }).addTo(map)

  try {
    if (!mapGeometry.value) return
    const data = JSON.parse(mapGeometry.value)
    if (data.geom?.type && data.geom?.coordinates) {
      const feature = {
        type: 'Feature',
        properties: {},
        geometry: { type: data.geom.type, coordinates: data.geom.coordinates }
      }
      
      const layer = L.geoJSON(feature, {
        style: {
          color: riskColor.value,
          weight: 3,
          opacity: 1,
          fillColor: riskColor.value,
          fillOpacity: 0.25
        }
      }).addTo(map)
      map.fitBounds(layer.getBounds(), { padding: [40, 40] })
    }
  } catch (e) { console.error('Map geometry error', e) }
}

onMounted(() => nextTick(initMap))
onUnmounted(() => map?.remove())

watch([
  () => geocodingResult.value?.lat,
  () => geocodingResult.value?.lng,
  () => mapResult.value?.map,
  () => fireRiskResult.value
], () => nextTick(initMap))

watch(() => globalStore.isDark, () => nextTick(initMap))
</script>

<style scoped>
#map { filter: grayscale(0.1) contrast(1.05) saturate(0.9); }
.dark #map { filter: grayscale(0.15) contrast(1.1) saturate(0.85); }

:global(.pulse-ring) {
  animation: pulseRing 2s ease-out infinite;
}

:global(.pulse-dot) {
  transform: translateZ(0);
}

@keyframes pulseRing {
  0% { transform: scale(0.5); opacity: 0.5; }
  100% { transform: scale(2); opacity: 0; }
}
</style>
