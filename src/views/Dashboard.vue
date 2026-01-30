<template>
  <div class="min-h-screen bg-gray-50 dark:bg-background flex overflow-x-hidden">
    <Sidebar
      :userName="userName"
      :userInitials="userInitials"
    />

    <div 
      class="flex-1 flex flex-col min-w-0 transition-[margin] duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]"
      :class="sidebarOpenClass"
    >
      <header class="p-3 sm:p-4 md:p-6 flex items-center">
        <HeaderControls
          @new-chat="handleNewChat"
        />
      </header>

      <main 
        class="flex-1 flex flex-col items-center justify-center px-3 sm:px-4 md:px-6 overflow-hidden"
        :class="globalStore.dashboard ? 'h-screen' : ''"
      >
        <template v-if="!globalStore.dashboard">
          <div v-if="!globalStore.isSearchLoading" class="flex items-center gap-2 sm:gap-3 mb-6 sm:mb-9 px-2 sm:px-0">
            <Logo 
              v-if="!globalStore.searchError"
              brand
              :risk="dashboardRiskLevel"
              class="w-6 h-6 sm:w-8 sm:h-8 flex-shrink-0" 
            />
            <h1 
              class="text-lg sm:text-xl md:text-2xl font-semibold transition-colors"
              :class="globalStore.searchError 
                ? 'text-red-500 dark:text-red-500' 
                : 'text-gray-900 dark:text-foreground'"
            >
              {{ globalStore.searchError || t('dashboard.whatRegion') }}
            </h1>
          </div>
          <div class="w-full flex justify-center">
            <SearchInput
              v-if="!globalStore.isSearchLoading"
            />
            <Loading v-else class="w-full h-full" />
          </div>
        </template>
        
        <div v-if="globalStore.dashboard" class="w-full max-w-7xl px-2 sm:px-4 lg:px-6 py-2 sm:py-3 overflow-y-auto">
          <LocationAnalysis 
            v-if="globalStore.orchestratorResponse"
            :orchestrator-response="globalStore.orchestratorResponse"
          />
        </div>
      </main>
    </div>

    <div 
      v-if="globalStore.isSidebarOpen"
      class="fixed inset-0 bg-black/30 z-30 lg:hidden"
      @click="globalStore.isSidebarOpen = false"
    ></div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useGlobalStore } from '@/stores/global'
import { useI18n } from '@/composables/useI18n'
import Logo from '@/components/ui/logo.vue'
import SearchInput from '@/components/SearchInput.vue'
import HeaderControls from '@/components/HeaderControls.vue'
import Sidebar from '@/components/Sidebar.vue'
import Loading from '@/components/Loading.vue'
import LocationAnalysis from '@/components/LocationAnalysis.vue'

const router = useRouter()
const authStore = useAuthStore()
const globalStore = useGlobalStore()
const { t } = useI18n()

onMounted(() => {
  const token = localStorage.getItem('token')
  if (token) {
    authStore.setToken(token)
  }

  const userStr = localStorage.getItem('user')
  if (userStr) {
    try {
      const user = JSON.parse(userStr)
      if (user && user.id) {
        globalStore.setUser(user)
      }
    } catch (error) {
      console.error('Erro ao parsear user do localStorage:', error)
      localStorage.removeItem('user')
    }
  }
})

const dashboardRiskLevel = computed(() => globalStore.orchestratorResponse?.fire_risk_result?.risk_level ?? null)

const userName = computed(() => {
  return globalStore.user?.name || t('dashboard.user')
})

const userInitials = computed(() => {
  const name = userName.value
  const names = name.split(' ')
  if (names.length >= 2) {
    return names[0][0].toUpperCase() + names[names.length - 1][0].toUpperCase()
  }
  return name[0]?.toUpperCase() || 'U'
})

authStore.isAuthenticated = true

const sidebarOpenClass = computed(() => {
  if (globalStore.isSidebarOpen) {
    return 'lg:ml-[16.7rem]'
  }
  return 'lg:ml-0'
})

watch(() => globalStore.isSidebarOpen, (newValue) => {
  if (newValue) {
  } else {
  }
})

watch(() => globalStore.selectedSearch, (newSearch) => {
  if (newSearch) {
    globalStore.setSearchQuery(newSearch.location)
  }
})

const handleNewChat = () => {
  globalStore.setSearchQuery('')
}

function navigateTo(path) {
  router.push(path)
}
</script>

<style scoped>
</style>
