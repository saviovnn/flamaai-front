<template>
  <Teleport to="body">
    <Transition name="command-k">
      <div
        v-if="globalStore.isCommandKOpen"
        class="fixed inset-0 z-[60] flex items-start justify-center pt-[15vh] px-3 sm:px-4"
      >
        <div
          class="absolute inset-0 bg-black/40 backdrop-blur-sm"
          @click="closeModal"
        />

        <div
          class="relative w-full max-w-xl min-w-0 bg-white dark:bg-card rounded-xl shadow-xl border border-gray-200 dark:border-border overflow-hidden"
          role="dialog"
          aria-label="Buscar histórico de análises"
          @keydown.capture="handleKeydown"
        >
          <!-- Campo de busca -->
          <div class="flex items-center gap-2 px-3 py-3 border-b border-gray-200 dark:border-border min-w-0">
            <Search class="w-4 h-4 text-gray-400 dark:text-muted-foreground flex-shrink-0" />
            <input
              ref="inputRef"
              v-model="searchQuery"
              type="text"
              class="flex-1 min-w-0 bg-transparent text-sm text-gray-900 dark:text-foreground placeholder-gray-400 dark:placeholder-muted-foreground py-1 border-0 focus:outline-none focus:ring-0 focus:border-0 focus:shadow-none"
              :placeholder="t('commandK.placeholder')"
              autocomplete="off"
              @input="onSearchInput"
              @keydown="onInputKeydown"
            />
            <kbd class="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-gray-100 dark:bg-accent text-[10px] text-gray-500 dark:text-muted-foreground font-mono">
              esc
            </kbd>
          </div>

          <!-- Lista: skeleton ao carregar ou aguardando pesquisa -->
          <div v-if="showSearchSkeleton" class="max-h-[min(60vh,320px)] overflow-hidden p-3">
            <div
              v-for="i in 6"
              :key="i"
              class="flex items-center gap-3 px-4 py-3 rounded-lg"
            >
              <div class="w-8 h-8 rounded-full skeleton-box flex-shrink-0" />
              <div class="flex-1 min-w-0">
                <div class="h-3.5 w-3/4 rounded skeleton-box mb-1.5" />
                <div class="h-3 w-1/2 rounded skeleton-box" />
              </div>
            </div>
          </div>

          <!-- Lista: itens filtrados (máx. 10, scroll invisível) -->
          <div
            v-else
            class="max-h-[min(60vh,320px)] overflow-y-auto overflow-x-hidden min-w-0 p-3 command-k-list"
          >
            <template v-if="filteredSearches.length > 0">
              <button
                v-for="(search, index) in filteredSearches"
                :key="search.key"
                :ref="(el) => index === selectedIndex && (selectedItemRef = el)"
                type="button"
                class="w-full min-w-0 max-w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors"
                :class="index === selectedIndex
                  ? 'bg-gray-100 dark:bg-accent'
                  : 'hover:bg-gray-50 dark:hover:bg-accent/50'"
                @click="selectSearch(search)"
              >
                <Tooltip :text="getRiscoTooltip(getRiskForLogo(search))" position="right">
                  <Logo
                    :risk="getRiskForLogo(search)"
                    class="w-8 h-8 flex-shrink-0 cursor-default"
                  />
                </Tooltip>
                <div class="flex-1 min-w-0 overflow-hidden">
                  <p class="text-sm font-medium text-gray-900 dark:text-foreground truncate">
                    {{ search.location }}
                  </p>
                  <p class="text-xs text-gray-500 dark:text-muted-foreground truncate">
                    {{ formatDate(search.dateObj) }}
                  </p>
                </div>
              </button>
            </template>
            <div
              v-else
              class="px-4 py-8 text-center text-sm text-gray-500 dark:text-muted-foreground"
            >
              {{ searchQuery.trim() ? t('commandK.noResults') : t('commandK.empty') }}
            </div>
          </div>

          <!-- Rodapé com dica -->
          <div class="px-3 py-2 border-t border-gray-200 dark:border-border flex items-center justify-between text-[10px] text-gray-400 dark:text-muted-foreground">
            <span>{{ t('commandK.hintNavigate') }}</span>
            <span>{{ t('commandK.hintSelect') }}</span>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, computed, watch, nextTick, onUnmounted } from 'vue'
import { Search } from 'lucide-vue-next'
import { useGlobalStore } from '@/stores/global'
import { useI18n } from '@/composables/useI18n'
import { getAllSearchHistoryService, orchestratorService } from '@/api/services'
import Logo from '@/components/ui/logo.vue'
import Tooltip from '@/components/Tooltip.vue'

const { t, locale } = useI18n()
const globalStore = useGlobalStore()
const inputRef = ref(null)
const selectedItemRef = ref(null)
const searchQuery = ref('')
const selectedIndex = ref(0)
const isHistoryLoading = ref(false)
const searchDebounceTimer = ref(null)
const DEBOUNCE_MS = 500
const MIN_CHARS_TO_SEARCH = 3

const showSearchSkeleton = computed(() => {
  const hasSearchQuery = searchQuery.value.trim().length >= MIN_CHARS_TO_SEARCH
  const isDebouncing = searchDebounceTimer.value != null
  return isHistoryLoading.value || (hasSearchQuery && isDebouncing)
})

const riscoTooltips = computed(() => ({
  critico: t('analysis.weeklyCritico'),
  alto: t('analysis.weeklyAlto'),
  medio: t('analysis.weeklyMedio'),
  baixo: t('analysis.weeklyBaixo'),
  regular: t('analysis.weeklyRegular'),
  undefined: t('sidebar.riskUndefined')
}))

const riscoRules = {
  baixo: '< 20%',
  regular: '20% - 40%',
  medio: '40% - 60%',
  alto: '60% - 80%',
  critico: '≥ 80%',
  undefined: '—'
}

const mapRiskLevel = (riskLevel) => {
  const normalized = ['baixo', 'regular', 'medio', 'alto', 'critico'].includes(riskLevel)
    ? riskLevel
    : { high: 'alto', regular: 'regular', low: 'baixo', 'N/A': 'undefined' }[riskLevel] ?? 'undefined'
  return normalized
}

const getRiscoTooltip = (riscoMedio) => {
  const label = riscoTooltips.value[riscoMedio] || riscoTooltips.value.undefined
  const rule = riscoRules[riscoMedio] ?? riscoRules.undefined
  return rule !== '—' ? `${label} (${rule})` : label
}

/** Garante um nível de risco válido para o Logo (baixo|regular|medio|alto|critico|undefined) */
function getRiskForLogo(search) {
  const risk = search.data?.risco_medio ?? mapRiskLevel(search.data?.risk_level ?? search.rawData?.risk_level)
  return risk && ['baixo', 'regular', 'medio', 'alto', 'critico'].includes(risk) ? risk : 'undefined'
}

function formatDate(dateObj) {
  if (!dateObj || !(dateObj instanceof Date)) return ''
  return new Intl.DateTimeFormat(locale.value === 'pt' ? 'pt-BR' : locale.value === 'es' ? 'es' : 'en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  }).format(dateObj)
}

const isSearchMode = computed(() => searchQuery.value.trim().length >= MIN_CHARS_TO_SEARCH)

function parseHistoryItems(items) {
  if (!Array.isArray(items)) return []
  return items.map((item) => {
    const dateObj = new Date(item.created_at)
    const riskLevelMapped = mapRiskLevel(item.risk_level)
    return {
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
    }
  })
}

const parsedSearches = computed(() => {
  const searches = []

  if (isSearchMode.value && Array.isArray(globalStore.commandKSearchResults)) {
    return parseHistoryItems(globalStore.commandKSearchResults)
      .filter((s) => (s.data?.id ?? s.rawData?.id) != null)
      .sort((a, b) => b.dateObj - a.dateObj)
  }

  if (Array.isArray(globalStore.searchHistoryList)) {
    globalStore.searchHistoryList.forEach((item) => {
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
    const id = value?.id ?? value?.rawData?.id
    if (id == null) continue
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

  return searches
    .filter((s) => (s.data?.id ?? s.rawData?.id) != null)
    .sort((a, b) => b.dateObj - a.dateObj)
})

const normalizedQuery = computed(() => searchQuery.value.trim().toLowerCase())

const filteredSearches = computed(() => {
  const base = parsedSearches.value
  const limited = base.slice(0, 10)
  if (isSearchMode.value) return limited
  if (!normalizedQuery.value) return limited
  const q = normalizedQuery.value
  return limited.filter((search) => {
    const locationMatch = search.location.toLowerCase().includes(q)
    const dateStr = formatDate(search.dateObj).toLowerCase()
    const dateMatch = dateStr.includes(q)
    const day = String(search.dateObj.getDate()).padStart(2, '0')
    const month = String(search.dateObj.getMonth() + 1).padStart(2, '0')
    const year = String(search.dateObj.getFullYear())
    const numericMatch = `${day}${month}${year}`.includes(q.replace(/\D/g, '')) ||
      dateStr.replace(/\s/g, '').includes(q.replace(/\s/g, ''))
    return locationMatch || dateMatch || numericMatch
  })
})

function onEscape(e) {
  if (e.key === 'Escape' && globalStore.isCommandKOpen) {
    e.preventDefault()
    e.stopPropagation()
    closeModal()
  }
}

function onArrowKeys(e) {
  if (!globalStore.isCommandKOpen) return
  if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
    e.preventDefault()
  }
}

watch(() => globalStore.isCommandKOpen, (open) => {
  if (open) {
    searchQuery.value = ''
    selectedIndex.value = 0
    clearSearchDebounce()
    window.addEventListener('keydown', onEscape, true)
    window.addEventListener('keydown', onArrowKeys, true)
    loadHistory()
    nextTick(() => {
      setTimeout(() => {
        inputRef.value?.focus()
      }, 180)
    })
  } else {
    clearSearchDebounce()
    window.removeEventListener('keydown', onEscape, true)
    window.removeEventListener('keydown', onArrowKeys, true)
  }
})

onUnmounted(() => {
  clearSearchDebounce()
  window.removeEventListener('keydown', onEscape, true)
  window.removeEventListener('keydown', onArrowKeys, true)
})

watch(filteredSearches, (list) => {
  if (selectedIndex.value >= list.length) {
    selectedIndex.value = Math.max(0, list.length - 1)
  }
}, { immediate: true })

watch(selectedIndex, (idx) => {
  if (idx < 0) selectedIndex.value = 0
  const list = filteredSearches.value
  if (list.length && idx >= list.length) selectedIndex.value = list.length - 1
  nextTick(() => {
    selectedItemRef.value?.scrollIntoView?.({ block: 'nearest', behavior: 'smooth' })
  })
})

async function loadHistory(search = undefined) {
  if (!globalStore.user?.id) return
  isHistoryLoading.value = true
  try {
    const data = await getAllSearchHistoryService(globalStore.user.id, search)
    if (search != null && search.trim() !== '') {
      globalStore.setCommandKSearchResults(data)
    } else {
      globalStore.setSearchHistoryList(data)
      globalStore.setCommandKSearchResults([])
    }
  } catch (error) {
    console.error('Erro ao carregar histórico:', error)
  } finally {
    isHistoryLoading.value = false
  }
}

function clearSearchDebounce() {
  if (searchDebounceTimer.value != null) {
    clearTimeout(searchDebounceTimer.value)
    searchDebounceTimer.value = null
  }
}

function scheduleSearch() {
  clearSearchDebounce()
  const trimmed = searchQuery.value.trim()
  if (trimmed.length >= MIN_CHARS_TO_SEARCH) {
    searchDebounceTimer.value = setTimeout(() => {
      searchDebounceTimer.value = null
      loadHistory(trimmed)
    }, DEBOUNCE_MS)
  } else if (trimmed.length === 0) {
    loadHistory()
  }
}

function onSearchInput() {
  selectedIndex.value = 0
  scheduleSearch()
}

function onInputKeydown(e) {
  if (e.key === 'Escape') {
    e.preventDefault()
    e.stopPropagation()
    closeModal()
    return
  }
  if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
    e.preventDefault()
    handleKeydown(e)
  }
}

function closeModal() {
  globalStore.isCommandKOpen = false
}

async function selectSearch(search) {
  try {
    globalStore.setSearchLoading(true)
    const location_id = search.data?.id || search.rawData?.id
    if (!location_id) {
      globalStore.setSearchLoading(false)
      return
    }
    const data = await orchestratorService.getSingle(location_id)
    globalStore.setOrchestratorResponse(data)
    closeModal()
  } catch (error) {
    console.error('Erro ao buscar dados do location:', error)
  } finally {
    globalStore.setSearchLoading(false)
  }
}

function handleKeydown(e) {
  if (!globalStore.isCommandKOpen) return
  if (e.key === 'Escape') {
    e.preventDefault()
    closeModal()
    return
  }
  const list = filteredSearches.value
  if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
    if (e.eventPhase === Event.CAPTURING_PHASE && e.target?.tagName === 'INPUT') return
    e.preventDefault()
    if (e.key === 'ArrowDown') {
      selectedIndex.value = Math.min(selectedIndex.value + 1, list.length - 1)
    } else {
      selectedIndex.value = Math.max(selectedIndex.value - 1, 0)
    }
    return
  }
  if (e.key === 'Enter' && list.length > 0 && list[selectedIndex.value]) {
    e.preventDefault()
    selectSearch(list[selectedIndex.value])
  }
}
</script>

<style scoped>
.command-k-enter-active,
.command-k-leave-active {
  transition: opacity 0.15s ease;
}
.command-k-enter-from,
.command-k-leave-to {
  opacity: 0;
}
.command-k-enter-from > div:last-child,
.command-k-leave-to > div:last-child {
  transform: scale(0.98);
  transition: transform 0.15s ease;
}

.skeleton-box {
  background: linear-gradient(
    90deg,
    rgb(229 231 235) 25%,
    rgb(243 244 246) 50%,
    rgb(229 231 235) 75%
  );
  background-size: 200% 100%;
  animation: skeleton 1.2s ease-in-out infinite;
}
:root.dark .skeleton-box {
  background: linear-gradient(
    90deg,
    hsl(220, 13%, 22%) 25%,
    hsl(220, 13%, 18%) 50%,
    hsl(220, 13%, 22%) 75%
  );
  background-size: 200% 100%;
}
@keyframes skeleton {
  to {
    background-position: 200% 0;
  }
}

/* Barra de rolagem invisível */
.command-k-list {
  scrollbar-width: none;
  -ms-overflow-style: none;
}
.command-k-list::-webkit-scrollbar {
  display: none;
}
</style>
