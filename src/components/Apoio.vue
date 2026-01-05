<template>
  <div class="flex items-center gap-2 justify-center">
      <span class="text-sm font-medium text-gray-900 dark:text-white">Apoiado por:</span>
        <a href="https://www.maritaca.ai/research" target="_blank" rel="noopener noreferrer">
          <img
            :src="logoPath"
            alt="Maritaca AI"
            width="50"
            height="50"
            style="display: block; cursor: pointer;"
          />
        </a>

    </div>
</template>
<script setup>
import { computed } from 'vue'
import { useGlobalStore } from '@/stores/global'
import maritacaLogoLight from '@/assets/maritaca_logo_light.svg'
import maritacaLogoDark from '@/assets/maritaca_logo_dark.svg'

const globalStore = useGlobalStore()

const logoPath = computed(() => {
  return globalStore.isDark ? maritacaLogoDark : maritacaLogoLight
})
</script>
<style scoped>
</style>