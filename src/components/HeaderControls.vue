<template>
  <div class="flex items-center gap-2">
    <div class="flex items-center justify-center">
      <img :src="logo" alt="FlamaAI" class="w-7 h-7" />
    </div>
    
    <div class="flex items-center gap-1 bg-white rounded-full border border-gray-200 p-0.5">
      <Tooltip text="Abrir barra lateral" position="bottom">
        <button
          @click="toggleSidebar()"
          class="p-1.5 rounded-full hover:bg-gray-100 transition-colors"
        >
          <PanelLeft :size="16" class="text-gray-700" />
        </button>
      </Tooltip>
      
      <Tooltip text="Nova analise" position="bottom">
        <button
          @click="handleNewAnalysis(); $emit('new-chat')"
          class="p-1.5 rounded-full hover:bg-gray-100 transition-colors"
        >
          <BadgePlus :size="16" class="text-gray-700" />
        </button>
      </Tooltip>
    </div>
  </div>
</template>

<script setup>
import { BadgePlus, PanelLeft } from 'lucide-vue-next'
import logo from '@/assets/logo.svg'
import Tooltip from './Tooltip.vue'
import { useGlobalStore } from '@/stores/global'

const globalStore = useGlobalStore()

defineEmits(['new-chat'])

const toggleSidebar = () => {
  globalStore.isSidebarOpen = !globalStore.isSidebarOpen
}

const handleNewAnalysis = () => {
  globalStore.selectedSearch = null
  globalStore.isSidebarOpen = false
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
