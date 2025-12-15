<template>
  <Teleport to="body">
    <Transition name="modal">
      <div 
        v-if="globalStore.isSettingsOpen" 
        class="fixed inset-0 z-50 flex items-center justify-center"
      >
        <div 
          class="absolute inset-0 bg-black/30 backdrop-blur-sm"
          @click="closeModal"
        ></div>
        
        <div class="relative bg-white dark:bg-card rounded-2xl shadow-xl w-full max-w-2xl mx-4 flex overflow-hidden" style="height: 420px;">
          <div class="w-48 p-4 flex flex-col gap-1">
            <h2 class="text-lg font-semibold text-gray-900 dark:text-foreground mb-4">Configurações</h2>
            
            <button
              v-for="tab in tabs"
              :key="tab.id"
              @click="activeTab = tab.id"
              :class="[
                'flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors text-left',
                activeTab === tab.id 
                  ? 'bg-gray-100 dark:bg-accent text-gray-900 dark:text-foreground font-medium' 
                  : 'text-gray-600 dark:text-muted-foreground hover:bg-gray-50 dark:hover:bg-secondary'
              ]"
            >
              <component :is="tab.icon" :size="18" />
              {{ tab.label }}
            </button>
          </div>
          
          <div class="flex-1 px-6 py-12 overflow-y-auto">
            <button 
              @click="closeModal"
              class="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-accent transition-colors text-gray-500 dark:text-muted-foreground"
            >
              <X :size="20" />
            </button>
            
            <div v-if="activeTab === 'geral'">
              <div class="mb-6 mt-4">
                <h3 class="text-sm font-medium text-gray-700 dark:text-muted-foreground mb-3">Tema</h3>
                <div class="flex gap-3">
                  <ThemeButton 
                    :active="globalStore.theme === 'light'"
                    @click="setTheme('light')"
                    label="Claro"
                    class="flex-1"
                  >
                    <Sun :size="20" />
                  </ThemeButton>
                  
                  <ThemeButton 
                    :active="globalStore.theme === 'dark'"
                    @click="setTheme('dark')"
                    label="Escuro"
                    class="flex-1"
                  >
                    <Moon :size="20" />
                  </ThemeButton>
                  
                  <ThemeButton 
                    :active="globalStore.theme === 'system'"
                    @click="setTheme('system')"
                    label="Sistema"
                    class="flex-1"
                  >
                    <Monitor :size="20" />
                  </ThemeButton>
                </div>
              </div>
            </div>
            
            <div v-if="activeTab === 'perfil'" class="space-y-0">
              <div class="flex items-center justify-between py-4 border-b border-gray-100 dark:border-border">
                <span class="text-sm text-gray-700 dark:text-muted-foreground">Nome</span>
                <span class="text-sm text-gray-900 dark:text-foreground">{{ userName }}</span>
              </div>
              
              <div class="flex items-center justify-between py-4 border-b border-gray-100 dark:border-border">
                <span class="text-sm text-gray-700 dark:text-muted-foreground">Endereço de e-mail</span>
                <span class="text-sm text-gray-900 dark:text-foreground">{{ userEmail }}</span>
              </div>
              
              <div class="flex items-center justify-between py-4">
                <span class="text-sm text-gray-700 dark:text-muted-foreground">Sair de todos os dispositivos</span>
                <button 
                  @click="handleLogout"
                  class="px-4 py-1.5 text-sm text-red-500 border border-red-300 dark:border-red-500/50 rounded-full hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                >
                  Sair
                </button>
              </div>
            </div>
            
            <div v-if="activeTab === 'sobre'" class="space-y-0">
              <div class="flex items-center justify-between py-4 border-b border-gray-100 dark:border-border">
                <span class="text-sm text-gray-700 dark:text-muted-foreground">Termos de Uso</span>
                <button 
                  @click="openTermos"
                  class="px-4 py-1.5 text-sm text-gray-700 dark:text-muted-foreground border border-gray-300 dark:border-border rounded-full hover:bg-gray-50 dark:hover:bg-secondary transition-colors"
                >
                  Ver
                </button>
              </div>
              
              <div class="flex items-center justify-between py-4">
                <span class="text-sm text-gray-700 dark:text-muted-foreground">Política de Privacidade</span>
                <button 
                  @click="openPrivacidade"
                  class="px-4 py-1.5 text-sm text-gray-700 dark:text-muted-foreground border border-gray-300 dark:border-border rounded-full hover:bg-gray-50 dark:hover:bg-secondary transition-colors"
                >
                  Ver
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, markRaw } from 'vue'
import { X, Settings, User, Info, Sun, Moon, Monitor } from 'lucide-vue-next'
import { useRouter } from 'vue-router'
import { useGlobalStore } from '@/stores/global'
import { useAuthStore } from '@/stores/auth'
import ThemeButton from './ThemeButton.vue'

const globalStore = useGlobalStore()
const authStore = useAuthStore()
const router = useRouter()

const activeTab = ref('geral')

const userName = 'Sávio Vianna'
const userEmail = 'sav*****ev@gmail.com'

const tabs = [
  { id: 'geral', label: 'Geral', icon: markRaw(Settings) },
  { id: 'perfil', label: 'Perfil', icon: markRaw(User) },
  { id: 'sobre', label: 'Sobre', icon: markRaw(Info) }
]

const closeModal = () => {
  globalStore.isSettingsOpen = false
}

const setTheme = (newTheme) => {
  globalStore.setTheme(newTheme)
}

const handleLogout = () => {
  closeModal()
  authStore.logout()
  router.push('/login')
}

const openTermos = () => {
}

const openPrivacidade = () => {
}
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: all 0.2s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from > div:last-child,
.modal-leave-to > div:last-child {
  transform: scale(0.95);
}
</style>
