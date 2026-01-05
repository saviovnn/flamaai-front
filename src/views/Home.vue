<template>
  <div class="flex items-center justify-center h-screen relative">
    <ThemeSwitcher />
    <div class="d-flex flex-column align-center justify-center gap-12">
      <Globe :width="600" :height="450" :satelliteSize="3" :satelliteDistance="-1" />
      <Apoio />
    </div>
  </div>
</template>

<script setup>
import Globe from '@/components/Globe.vue'
import Apoio from '@/components/Apoio.vue'
import ThemeSwitcher from '@/components/ThemeSwitcher.vue'
</script>
