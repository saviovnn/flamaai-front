<template>
  <div class="w-full dark">
    <Header />
    <Hero />
    <HowItWorks id="features" class="how-it-works-section" />
    <GlobeSection />
    <Benefits />
    <DataSources />
    <FAQ />
    <Footer />
  </div>
</template>

<script setup>
import { onMounted, onUnmounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useGlobalStore } from '@/stores/global'
import Header from '@/components/ui/Header.vue'
import Hero from '@/components/Hero.vue'
import HowItWorks from '@/components/HowItWorks.vue'
import GlobeSection from '@/components/GlobeSection.vue'
import Benefits from '@/components/Benefits.vue'
import DataSources from '@/components/DataSources.vue'
import FAQ from '@/components/FAQ.vue'
import Footer from '@/components/Footer.vue'

const route = useRoute()
const globalStore = useGlobalStore()

const forceDarkTheme = () => {
  document.documentElement.classList.add('dark')
  document.documentElement.setAttribute('data-home-theme-override', 'true')
}

const restoreTheme = () => {
  if (document.documentElement.getAttribute('data-home-theme-override') === 'true') {
    document.documentElement.removeAttribute('data-home-theme-override')
    
    if (globalStore.isDark) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }
}

const stopThemeWatcher = watch(() => globalStore.theme, () => {
  if (route.path === '/') {
    forceDarkTheme()
  }
})

onMounted(() => {
  forceDarkTheme()
})

onUnmounted(() => {
  restoreTheme()
  stopThemeWatcher()
})

watch(() => route.path, (newPath) => {
  if (newPath === '/') {
    forceDarkTheme()
  } else {
    restoreTheme()
  }
}, { immediate: true })
</script>
