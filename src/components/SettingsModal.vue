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
        
        <div class="relative bg-white dark:bg-card rounded-xl sm:rounded-2xl shadow-xl w-full max-w-2xl mx-2 sm:mx-4 flex flex-col sm:flex-row overflow-hidden max-h-[90vh] sm:max-h-[85vh] min-h-[455px] sm:min-h-0 sm:h-[420px]">
          <div class="w-full sm:w-48 border-b sm:border-b-0 sm:border-r border-gray-200 dark:border-border p-3 sm:p-4 flex flex-col gap-1">
            <div class="flex items-center justify-between mb-3 sm:mb-4">
              <h2 class="text-base sm:text-lg font-semibold text-gray-900 dark:text-foreground">{{ t('settings.title') }}</h2>
              <button 
                @click="closeModal"
                class="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-accent transition-colors text-gray-500 dark:text-muted-foreground sm:hidden"
              >
                <X :size="18" />
              </button>
            </div>
            
            <div class="flex flex-row sm:flex-col gap-1 overflow-x-auto sm:overflow-x-visible">
              <button
                v-for="tab in tabs"
                :key="tab.id"
                @click="activeTab = tab.id"
                :class="[
                  'flex items-center gap-2 sm:gap-3 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm transition-colors text-left whitespace-nowrap',
                  activeTab === tab.id 
                    ? 'bg-gray-100 dark:bg-accent text-gray-900 dark:text-foreground font-medium' 
                    : 'text-gray-600 dark:text-muted-foreground hover:bg-gray-50 dark:hover:bg-secondary'
                ]"
              >
                <component :is="tab.icon" :size="16" class="sm:w-[18px] sm:h-[18px]" />
                {{ tab.label }}
              </button>
            </div>
          </div>
          
          <div class="flex-1 px-4 sm:px-6 py-6 sm:py-12 overflow-y-auto relative">
            <button 
              @click="closeModal"
              class="hidden sm:block absolute top-4 right-4 p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-accent transition-colors text-gray-500 dark:text-muted-foreground z-10"
            >
              <X :size="20" />
            </button>
            
            <div v-if="activeTab === 'geral'">
              <div class="mb-4 sm:mb-6 mt-0 sm:mt-4">
                <h3 class="text-xs sm:text-sm font-medium text-gray-700 dark:text-muted-foreground mb-2 sm:mb-3">{{ t('settings.theme') }}</h3>
                <div class="flex flex-col sm:flex-row gap-2 sm:gap-3">
                  <ThemeButton 
                    :active="globalStore.theme === 'light'"
                    @click="setTheme('light')"
                    :label="t('settings.themeLight')"
                    class="w-full sm:flex-1"
                  >
                    <Sun :size="18" class="sm:w-5 sm:h-5" />
                  </ThemeButton>
                  
                  <ThemeButton 
                    :active="globalStore.theme === 'dark'"
                    @click="setTheme('dark')"
                    :label="t('settings.themeDark')"
                    class="w-full sm:flex-1"
                  >
                    <Moon :size="18" class="sm:w-5 sm:h-5" />
                  </ThemeButton>
                  
                  <ThemeButton 
                    :active="globalStore.theme === 'system'"
                    @click="setTheme('system')"
                    :label="t('settings.themeSystem')"
                    class="w-full sm:flex-1"
                  >
                    <Monitor :size="18" class="sm:w-5 sm:h-5" />
                  </ThemeButton>
                </div>
              </div>
              
              <div class="mb-4 sm:mb-6">
                <h3 class="text-xs sm:text-sm font-medium text-gray-700 dark:text-muted-foreground mb-2 sm:mb-3">{{ t('settings.language') }}</h3>
                <div class="flex flex-col sm:flex-row gap-2 sm:gap-3">
                  <ThemeButton 
                    :active="globalStore.locale === 'pt'"
                    @click="setLocale('pt')"
                    :label="t('settings.languagePt')"
                    class="w-full sm:flex-1"
                  >
                    <Languages :size="18" class="sm:w-5 sm:h-5" />
                  </ThemeButton>
                  
                  <ThemeButton 
                    :active="globalStore.locale === 'en'"
                    @click="setLocale('en')"
                    :label="t('settings.languageEn')"
                    class="w-full sm:flex-1"
                  >
                    <Languages :size="18" class="sm:w-5 sm:h-5" />
                  </ThemeButton>
                  
                  <ThemeButton 
                    :active="globalStore.locale === 'es'"
                    @click="setLocale('es')"
                    :label="t('settings.languageEs')"
                    class="w-full sm:flex-1"
                  >
                    <Languages :size="18" class="sm:w-5 sm:h-5" />
                  </ThemeButton>
                </div>
              </div>
            </div>
            
            <div v-if="activeTab === 'perfil'" class="space-y-0">
              <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between py-3 sm:py-4 border-b border-gray-100 dark:border-border gap-1 sm:gap-0">
                <span class="text-xs sm:text-sm text-gray-700 dark:text-muted-foreground">{{ t('settings.name') }}</span>
                <span class="text-xs sm:text-sm text-gray-900 dark:text-foreground break-words">{{ globalStore.user.name }}</span>
              </div>
              
              <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between py-3 sm:py-4 border-b border-gray-100 dark:border-border gap-1 sm:gap-0">
                <span class="text-xs sm:text-sm text-gray-700 dark:text-muted-foreground">{{ t('settings.email') }}</span>
                <span class="text-xs sm:text-sm text-gray-900 dark:text-foreground break-all">{{ globalStore.user.email }}</span>
              </div>
              
              <div class="flex items-center justify-between py-3 sm:py-4">
                <span class="text-xs sm:text-sm text-gray-700 dark:text-muted-foreground">{{ t('settings.logout') }}</span>
                <button 
                  @click="handleLogout"
                  class="px-3 sm:px-4 py-1.5 text-xs sm:text-sm text-red-500 border border-red-300 dark:border-red-500/50 rounded-full hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                >
                  {{ t('settings.logout') }}
                </button>
              </div>
            </div>
            
            <div v-if="activeTab === 'sobre'" class="space-y-0">
              <div class="flex items-center justify-between py-3 sm:py-4 border-b border-gray-100 dark:border-border">
                <span class="text-xs sm:text-sm text-gray-700 dark:text-muted-foreground">{{ t('settings.termsOfUse') }}</span>
                <button 
                  @click="openTermos"
                  class="px-3 sm:px-4 py-1.5 text-xs sm:text-sm text-gray-700 dark:text-muted-foreground border border-gray-300 dark:border-border rounded-full hover:bg-gray-50 dark:hover:bg-secondary transition-colors"
                >
                  {{ t('settings.view') }}
                </button>
              </div>
              
              <div class="flex items-center justify-between py-3 sm:py-4">
                <span class="text-xs sm:text-sm text-gray-700 dark:text-muted-foreground">{{ t('settings.privacyPolicy') }}</span>
                <button 
                  @click="openPrivacidade"
                  class="px-3 sm:px-4 py-1.5 text-xs sm:text-sm text-gray-700 dark:text-muted-foreground border border-gray-300 dark:border-border rounded-full hover:bg-gray-50 dark:hover:bg-secondary transition-colors"
                >
                  {{ t('settings.view') }}
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
import { ref, markRaw, computed } from 'vue'
import { X, Settings, User, Info, Sun, Moon, Monitor, Languages } from 'lucide-vue-next'
import { useRouter } from 'vue-router'
import { useGlobalStore } from '@/stores/global'
import { useAuthStore } from '@/stores/auth'
import { useI18n } from '@/composables/useI18n'
import ThemeButton from './ThemeButton.vue'

const globalStore = useGlobalStore()
const authStore = useAuthStore()
const router = useRouter()
const { t, locale } = useI18n()

const activeTab = ref('geral')

const tabs = computed(() => {
  locale.value // dependência reativa para atualizar ao trocar idioma
  return [
    { id: 'geral', label: t('settings.general'), icon: markRaw(Settings) },
    { id: 'perfil', label: t('settings.profile'), icon: markRaw(User) },
    { id: 'sobre', label: t('settings.about'), icon: markRaw(Info) }
  ]
})

const closeModal = () => {
  globalStore.isSettingsOpen = false
}

const setTheme = (newTheme) => {
  globalStore.setTheme(newTheme)
}

const setLocale = (newLocale) => {
  globalStore.setLocale(newLocale)
}

const handleLogout = async () => {
  closeModal()
  
  try {
    await authStore.logout()
  } catch (error) {
    console.warn('Erro ao fazer logout:', error)
  }
  
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
