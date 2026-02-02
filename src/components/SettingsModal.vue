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
          <SettingsSidebar
            :title="t('settings.title')"
            :tabs="tabs"
            :active-tab="activeTab"
            @close="closeModal"
            @update:active-tab="activeTab = $event"
          />

          <div class="flex-1 px-4 sm:px-6 py-6 sm:py-12 overflow-y-auto relative">
            <button
              @click="closeModal"
              class="hidden sm:block absolute top-4 right-4 p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-accent transition-colors text-gray-500 dark:text-muted-foreground z-10"
            >
              <X :size="20" />
            </button>

            <SettingsGeneral
              v-if="activeTab === 'geral'"
              :theme="globalStore.theme"
              :locale="globalStore.locale"
              @set-theme="setTheme"
              @set-locale="setLocale"
            />

            <SettingsProfile
              v-if="activeTab === 'perfil'"
              :user="globalStore.user"
              @logout="handleLogout"
            />

            <SettingsAbout
              v-if="activeTab === 'sobre'"
              @open-terms="openTermos"
              @open-privacy="openPrivacidade"
            />
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, markRaw, computed } from 'vue'
import { X, Settings, User, Info } from 'lucide-vue-next'
import { useRouter } from 'vue-router'
import { useGlobalStore } from '@/stores/global'
import { useAuthStore } from '@/stores/auth'
import { useI18n } from '@/composables/useI18n'
import {
  SettingsSidebar,
  SettingsGeneral,
  SettingsProfile,
  SettingsAbout
} from './settings'

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
  closeModal()
  router.push('/termos-de-uso')
}

const openPrivacidade = () => {
  closeModal()
  router.push('/politica-de-privacidade')
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
