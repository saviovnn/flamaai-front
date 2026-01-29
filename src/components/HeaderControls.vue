<template>
  <div v-if="!globalStore.isSidebarOpen" class="flex items-center gap-2">
      <div class="flex items-center justify-center">
        <img 
          :src="logo" 
          alt="FlamaAI" 
          class="w-7 h-7 cursor-pointer" 
          @click="toggleSidebar()"
        />
      </div>
      
      <div class="flex items-center gap-1 bg-white dark:bg-card rounded-full border border-gray-200 dark:border-border p-0.5">
        <Tooltip :text="t('headerControls.openSidebar')" position="bottom">
          <button
            @click="toggleSidebar()"
            class="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-accent transition-colors"
          >
            <PanelLeft :size="16" class="text-gray-700 dark:text-muted-foreground" />
          </button>
        </Tooltip>
        
        <Tooltip :text="t('headerControls.newAnalysis')" position="bottom">
          <button
            @click="handleNewAnalysis(); $emit('new-chat')"
            class="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-accent transition-colors"
          >
            <BadgePlus :size="16" class="text-gray-700 dark:text-muted-foreground" />
          </button>
        </Tooltip>
      </div>
    </div>
</template>

<script setup>
import { computed } from 'vue'
import { BadgePlus, PanelLeft } from 'lucide-vue-next'
import logoLight from '@/assets/logo.svg'
import logoDark from '@/assets/logo-dark.svg'
import Tooltip from './Tooltip.vue'
import { useGlobalStore } from '@/stores/global'
import { useI18n } from '@/composables/useI18n'

const globalStore = useGlobalStore()
const { t } = useI18n()

const logo = computed(() => globalStore.isDark ? logoDark : logoLight)

defineEmits(['new-chat'])

const toggleSidebar = () => {
  globalStore.isSidebarOpen = !globalStore.isSidebarOpen
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
</script>

<style scoped>
button {
  transition: all 0.2s ease;
}

button:active {
  transform: scale(0.95);
}
</style>
