<template>
  <Transition name="sidebar">
    <aside
      v-if="globalStore.isSidebarOpen"
      class="fixed left-0 top-0 h-full w-[16.7rem] sm:w-[16.7rem] bg-white dark:bg-card border-r border-gray-200 dark:border-border flex flex-col z-40"
    >
      <div class="p-3 sm:p-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <img :src="logo" :alt="t('app.name')" class="w-7 h-7 sm:w-8 sm:h-8 flex-shrink-0" />
            <span class="text-lg sm:text-2xl font-bold text-gray-900 dark:text-foreground font-inter">{{ t('app.name') }}</span>
          </div>
          <Tooltip :text="t('sidebar.closeSidebar')" position="bottom">
            <button
              @click="closeSidebar()"
              class="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-accent transition-colors text-gray-600 dark:text-muted-foreground"
            >
              <PanelRight :size="18" />
            </button>
          </Tooltip>
        </div>
      </div>

      <div class="px-2 sm:px-3 py-3 sm:py-4">
        <button
          @click="handleNewAnalysis()"
          class="w-full flex items-center justify-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 bg-white dark:bg-card border border-gray-200 dark:border-border rounded-lg text-xs sm:text-sm font-medium text-gray-700 dark:text-muted-foreground hover:bg-gray-50 dark:hover:bg-secondary transition-colors"
        >
          <BadgePlus :size="16" class="sm:w-[18px] sm:h-[18px]" />
          {{ t('sidebar.newAnalysis') }}
        </button>
      </div>

      <div class="flex-1 overflow-y-auto pb-4">
        <div v-for="(group, period) in groupedSearches" :key="period" class="mb-3 sm:mb-4">
          <div class="px-3 sm:px-4 py-1.5 sm:py-2">
            <h3 class="text-[10px] sm:text-xs font-medium text-gray-500 dark:text-muted-foreground">{{ period }}</h3>
          </div>
          
          <div class="px-2 sm:px-3">
            <button
              v-for="search in group"
              :key="search.key"
              @click="handleSelectSearch(search)"
              class="w-full text-left px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-accent transition-colors"
            >
              <p class="text-xs sm:text-sm text-gray-900 dark:text-foreground truncate flex items-center gap-1.5">
                <Tooltip :text="getRiscoTooltip(search.data.risco_medio)" position="right">
                  <img 
                    :src="getRiscoLogo(search.data.risco_medio)" 
                    :alt="search.data.risco_medio"
                    class="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0 cursor-pointer"
                  />
                </Tooltip>
                {{ search.location }}
              </p>
            </button>
          </div>
        </div>

        <div v-if="Object.keys(groupedSearches).length === 0" class="px-3 sm:px-4 py-6 sm:py-8 text-center">
          <p class="text-xs sm:text-sm text-gray-500 dark:text-muted-foreground">{{ t('sidebar.noAnalysisYet') }}</p>
        </div>
      </div>
      
      <div class="relative">
        <div class="absolute bottom-full left-0 right-0 h-20 pointer-events-none sidebar-gradient"></div>
        
        <div class="px-2 sm:px-2 py-1.5 bg-white dark:bg-card">
          <UserMenu :userName="userName" :userInitials="userInitials" />
        </div>
      </div>
    </aside>
  </Transition>
</template>

<script setup>
import { computed, onMounted, watch } from 'vue'
import { BadgePlus, PanelRight } from 'lucide-vue-next'
import { useI18n } from '@/composables/useI18n'
import logoLight from '@/assets/logo.svg'
import logoDark from '@/assets/logo-dark.svg'
import logoAlto from '@/assets/logo-alto.svg'
import logoAltoDark from '@/assets/logo-alto-dark.svg'
import logoMedio from '@/assets/logo-medio.svg'
import logoMedioDark from '@/assets/logo-medio-dark.svg'
import logoBaixo from '@/assets/logo-baixo.svg'
import logoBaixoDark from '@/assets/logo-baixo-dark.svg'
import logoUndefined from '@/assets/logo-undefined.svg'
import logoUndefinedDark from '@/assets/logo-undefined-dark.svg'
import { useGlobalStore } from '@/stores/global'
import { useAuthStore } from '@/stores/auth'
import { getAllSearchHistoryService, orchestratorService } from '@/api/services'
import UserMenu from './UserMenu.vue'
import Tooltip from './Tooltip.vue'

const riscoLogosLight = {
  alto: logoAlto,
  medio: logoMedio,
  baixo: logoBaixo,
  undefined: logoUndefined
}

const riscoLogosDark = {
  alto: logoAltoDark,
  medio: logoMedioDark,
  baixo: logoBaixoDark,
  undefined: logoUndefinedDark
}

const { t } = useI18n()

const riscoTooltips = computed(() => ({
  alto: t('sidebar.riskHigh'),
  medio: t('sidebar.riskMedium'),
  baixo: t('sidebar.riskLow'),
  regular: t('sidebar.riskRegular'),
  low: t('sidebar.riskLow'),
  high: t('sidebar.riskHigh'),
  undefined: t('sidebar.riskUndefined')
}))

const globalStore = useGlobalStore()
const authStore = useAuthStore()

const mapRiskLevel = (riskLevel) => {
  const mapping = {
    'high': 'alto',
    'regular': 'medio',
    'low': 'baixo',
    'N/A': 'undefined'
  }
  return mapping[riskLevel] || 'undefined'
}

const getRiscoLogo = (riscoMedio) => {
  const logos = globalStore.isDark ? riscoLogosDark : riscoLogosLight
  const fallback = globalStore.isDark ? logoUndefinedDark : logoUndefined
  return logos[riscoMedio] || fallback
}

const getRiscoTooltip = (riscoMedio) => {
  return riscoTooltips.value[riscoMedio] || riscoTooltips.value.undefined
}

onMounted(async () => {
  if (globalStore.user.id) {
    try {
      const history = await getAllSearchHistoryService(globalStore.user.id)
      globalStore.setSearchHistoryList(history)
    } catch (error) {
      console.error('Erro ao carregar histórico:', error)
    }
  }
})

watch(() => globalStore.user.id, async (newUserId) => {
  if (newUserId) {
    try {
      const history = await getAllSearchHistoryService(newUserId)
      globalStore.setSearchHistoryList(history)
    } catch (error) {
      console.error('Erro ao carregar histórico:', error)
    }
  }
})

const logo = computed(() => globalStore.isDark ? logoDark : logoLight)

const props = defineProps({
  userName: {
    type: String,
    default: 'Usuário'
  },
  userInitials: {
    type: String,
    default: 'U'
  }
})

const closeSidebar = () => {
  globalStore.isSidebarOpen = false
}

const handleNewAnalysis = () => {
  globalStore.selectedSearch = null
  globalStore.isSidebarOpen = false
  globalStore.setOrchestratorResponse(null)
  globalStore.setSearchSubmitData({
    query: null,
    climaTempo: false,
    qualidadeAr: false
  })
}

const handleSelectSearch = async (search) => {
  try {
    globalStore.setSearchLoading(true)
    
    globalStore.isSidebarOpen = false
    
    const location_id = search.data?.id || search.rawData?.id
    
    if (!location_id) {
      console.error('location_id não encontrado no item:', search)
      globalStore.setSearchLoading(false)
      return
    }
    
    const data = await orchestratorService.getSingle(location_id)
    
    globalStore.setOrchestratorResponse(data)
    
  } catch (error) {
    console.error('Erro ao buscar dados do location:', error)
  } finally {
    globalStore.setSearchLoading(false)
  }
}

const parsedSearches = computed(() => {
  const searches = []
  
  if (Array.isArray(globalStore.searchHistoryList)) {
    globalStore.searchHistoryList.forEach(item => {
      const dateObj = new Date(item.created_at)
      const riskLevelMapped = mapRiskLevel(item.risk_level)
      
      searches.push({
        key: item.id,
        location: item.name,
        dateObj,
        month: dateObj.getMonth() + 1,
        year: dateObj.getFullYear(),
        data: {
          risco_medio: riskLevelMapped,
          risk_level: item.risk_level,
          id: item.id
        },
        rawData: item
      })
    })
  }
  
  for (const [key, value] of Object.entries(globalStore.searchHistory)) {
    const parts = key.split('-')
    const day = parts[parts.length - 3]
    const month = parts[parts.length - 2]
    const year = parts[parts.length - 1]
    const location = parts.slice(0, -3).join(' ')
    
    const dateObj = new Date(parseInt(year), parseInt(month) - 1, parseInt(day))
    
    searches.push({
      key,
      location: location.charAt(0).toUpperCase() + location.slice(1),
      dateObj,
      month: parseInt(month),
      year: parseInt(year),
      data: value
    })
  }
  
  return searches.sort((a, b) => b.dateObj - a.dateObj)
})

const groupedSearches = computed(() => {
  const groups = {}
  
  const today = new Date()
  const currentMonth = today.getMonth() + 1
  const currentYear = today.getFullYear()
  
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
  
  parsedSearches.value.forEach(search => {
    const searchDate = new Date(search.dateObj)
    searchDate.setHours(0, 0, 0, 0)
    const todayDate = new Date()
    todayDate.setHours(0, 0, 0, 0)
    
    let groupKey
    
    if (search.month === currentMonth && search.year === currentYear) {
      if (searchDate.getTime() === todayDate.getTime()) {
        groupKey = t('sidebar.today')
      } else if (searchDate >= thirtyDaysAgo) {
        groupKey = t('sidebar.last30Days')
      } else {
        groupKey = `${String(search.month).padStart(2, '0')}-${search.year}`
      }
    } else {
      groupKey = `${String(search.month).padStart(2, '0')}-${search.year}`
    }
    
    if (!groups[groupKey]) {
      groups[groupKey] = []
    }
    groups[groupKey].push(search)
  })
  
  const sortedGroups = {}
  const groupOrder = [t('sidebar.today'), t('sidebar.last30Days')]
  
  groupOrder.forEach(key => {
    if (groups[key]) {
      sortedGroups[key] = groups[key]
    }
  })
  
  Object.keys(groups)
    .filter(key => !groupOrder.includes(key))
    .sort((a, b) => {
      const [monthA, yearA] = a.split('-').map(Number)
      const [monthB, yearB] = b.split('-').map(Number)
      if (yearB !== yearA) return yearB - yearA
      return monthB - monthA
    })
    .forEach(key => {
      sortedGroups[key] = groups[key]
    })
  
  return sortedGroups
})

</script>

<style scoped>
.sidebar-enter-active,
.sidebar-leave-active {
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  will-change: transform;
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
}

.sidebar-enter-from,
.sidebar-leave-to {
  transform: translate3d(-100%, 0, 0);
}

.sidebar-enter-to,
.sidebar-leave-from {
  transform: translate3d(0, 0, 0);
}

.sidebar-gradient {
  background: linear-gradient(to top, rgba(255, 255, 255, 1) 0%, rgba(255, 255, 255, 0) 100%);
}

:root.dark .sidebar-gradient {
  background: linear-gradient(to top, hsl(220, 13%, 13%) 0%, transparent 100%);
}

.overflow-y-auto::-webkit-scrollbar {
  width: 6px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: transparent;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: #d1d5db;
  border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: #9ca3af;
}

:root.dark .overflow-y-auto::-webkit-scrollbar-thumb {
  background: hsl(220, 13%, 25%);
}

:root.dark .overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: hsl(220, 13%, 35%);
}
</style>
