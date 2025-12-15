<template>
  <div class="relative">
    <button 
      @click="toggleMenu"
      class="w-full flex items-center gap-2.5 px-2 py-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-accent transition-colors"
    >
      <div class="w-8 h-8 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center flex-shrink-0">
        <span class="text-xs font-semibold text-white">{{ userInitials }}</span>
      </div>
      <div class="flex-1 min-w-0 text-left">
        <p class="text-sm font-medium text-gray-900 dark:text-foreground truncate">{{ userName }}</p>
      </div>
      <MoreVertical :size="16" class="text-gray-400 dark:text-muted-foreground" />
    </button>

    <Transition name="menu">
      <div 
        v-if="isOpen"
        class="absolute bottom-full left-0 mb-2 bg-white dark:bg-card rounded-xl shadow-lg border border-gray-200 dark:border-border py-1.5 z-50 whitespace-nowrap"
      >
        <button
          @click="handleConfiguracao"
          class="w-full flex items-center gap-2.5 px-3 py-2 hover:bg-gray-50 dark:hover:bg-secondary transition-colors text-left"
        >
          <Settings :size="16" class="text-gray-600 dark:text-muted-foreground" />
          <span class="text-sm text-gray-700 dark:text-muted-foreground">Configurações</span>
        </button>
        
        <button
          @click="handleSair"
          class="w-full flex items-center gap-2.5 px-3 py-2 hover:bg-gray-50 dark:hover:bg-secondary transition-colors text-left"
        >
          <LogOut :size="16" class="text-gray-600 dark:text-muted-foreground" />
          <span class="text-sm text-gray-700 dark:text-muted-foreground">Sair</span>
        </button>
      </div>
    </Transition>

    <div 
      v-if="isOpen" 
      class="fixed inset-0 z-40" 
      @click="closeMenu"
    ></div>
    
    <SettingsModal />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Settings, LogOut, MoreVertical } from 'lucide-vue-next'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useGlobalStore } from '@/stores/global'
import SettingsModal from './SettingsModal.vue'

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

const router = useRouter()
const authStore = useAuthStore()
const globalStore = useGlobalStore()

const isOpen = ref(false)

const toggleMenu = () => {
  isOpen.value = !isOpen.value
}

const closeMenu = () => {
  isOpen.value = false
}

const handleConfiguracao = () => {
  console.log('Configurações clicado')
  closeMenu()
  globalStore.isSettingsOpen = true
}

const handleSair = () => {
  console.log('Sair clicado')
  closeMenu()
  authStore.logout()
  router.push('/login')
}
</script>

<style scoped>
.menu-enter-active,
.menu-leave-active {
  transition: all 0.2s ease;
}

.menu-enter-from,
.menu-leave-to {
  opacity: 0;
  transform: translateY(8px);
}
</style>
