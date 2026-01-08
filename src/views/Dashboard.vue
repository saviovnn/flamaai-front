<template>
  <div class="min-h-screen bg-gray-50 dark:bg-background flex overflow-x-hidden">
    <Sidebar
      :userName="userName"
      :userInitials="userInitials"
    />

    <!-- Main content wrapper - responsivo à sidebar -->
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
            <img :src="logo" alt="FlamaAI" class="w-6 h-6 sm:w-8 sm:h-8 flex-shrink-0" />
            <h1 class="text-lg sm:text-xl md:text-2xl font-semibold text-gray-900 dark:text-foreground">
              Qual região vamos analizar?
            </h1>
          </div>
          
          <div class="w-full flex justify-center">
            <SearchInput
              v-if="!globalStore.isSearchLoading"
              placeholder="Digite o nome da cidade, endereço latitude e longitude..."
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

    <!-- Overlay para fechar sidebar em mobile -->
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
import logoLight from '@/assets/logo.svg'
import logoDark from '@/assets/logo-dark.svg'
import SearchInput from '@/components/SearchInput.vue'
import HeaderControls from '@/components/HeaderControls.vue'
import Sidebar from '@/components/Sidebar.vue'
import Loading from '@/components/Loading.vue'
import LocationAnalysis from '@/components/LocationAnalysis.vue'

const router = useRouter()
const authStore = useAuthStore()
const globalStore = useGlobalStore()

onMounted(() => {
  // Verifica se há token no localStorage
  const token = localStorage.getItem('token')
  if (token) {
    authStore.setToken(token)
  }

  // O store global já carrega o user do localStorage automaticamente
  // Mas vamos garantir que está sincronizado
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

const logo = computed(() => globalStore.isDark ? logoDark : logoLight)

const userName = computed(() => {
  return globalStore.user?.name || 'Usuário'
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

// Classes para deslocar conteúdo quando sidebar está aberta (apenas em desktop)
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

watch(() => globalStore.searchSubmitData, (newData) => {
  if (newData && newData.query) {
    handleSearch(newData)
  }
}, { deep: true })

const handleNewChat = () => {
  globalStore.setSearchQuery('')
}

const addSearchToHistory = (location, searchData) => {
  const today = new Date()
  const dateStr = `${today.getDate()}-${today.getMonth() + 1}-${today.getFullYear()}`
  const key = `${location}-${dateStr}`
  
  globalStore.searchHistory[key] = searchData
}

const handleSearch = (data) => {
  
  const location = data.query.toLowerCase().replace(/\s+/g, '-')
  
  const searchData = {
    risco: [],
    humidade: [],
    temperatura: [],
    climaTempo: data.climaTempo,
    qualidadeAr: data.qualidadeAr,
    explicacao: 'Análise em andamento...'
  }
  
  addSearchToHistory(location, searchData)
  
}


function navigateTo(path) {
  router.push(path)
}
</script>

<style scoped>
</style>
