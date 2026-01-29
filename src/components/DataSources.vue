<template>
  <section id="fontes-dados" ref="sectionRef" class="relative py-24 lg:py-32 bg-background">
    <div class="relative mx-auto max-w-6xl px-6 lg:px-8">
      <!-- Header -->
      <div class="text-center mb-16">
        <div class="inline-flex items-center gap-2 mb-4 text-[#FA5D19] text-sm font-medium uppercase tracking-wider">
          <span>//</span>
          <span>{{ t('dataSources.sectionLabel') }}</span>
        </div>
        <h2 class="text-3xl md:text-4xl lg:text-5xl font-semibold mb-4 text-foreground">
          {{ t('dataSources.title') }}
        </h2>
        <p class="text-lg text-muted-foreground max-w-2xl mx-auto">
          {{ t('dataSources.subtitle') }}
        </p>
      </div>

      <!-- Data Sources Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 max-w-5xl mx-auto">
        <!-- INPE Card -->
        <a
          href="https://terrabrasilis.dpi.inpe.br/queimadas/portal/"
          target="_blank"
          rel="noopener noreferrer"
          class="group relative bg-card border border-border/50 rounded-lg p-8 lg:p-10 hover:border-border transition-all duration-300 hover:shadow-lg"
          :class="{ 'opacity-0 translate-y-8': !isVisible[0] }"
        >
          <div class="flex flex-col items-center text-center space-y-8">
            <!-- Logo Container -->
            <div class="w-32 h-32 lg:w-40 lg:h-40 flex items-center justify-center bg-background border border-border/30 rounded-lg p-6 group-hover:border-border transition-colors duration-300">
              <img 
                :src="inpeLogo" 
                alt="INPE - Instituto Nacional de Pesquisas Espaciais" 
                class="max-w-full max-h-full object-contain"
              />
            </div>

            <!-- Organization Name -->
            <div class="space-y-2">
              <h3 class="text-xl lg:text-2xl font-bold text-foreground tracking-tight">
                INPE
              </h3>
              <p class="text-sm text-muted-foreground font-light">
                Instituto Nacional de Pesquisas Espaciais
              </p>
            </div>

            <!-- External Link Indicator -->
            <div class="flex items-center gap-2 text-xs text-muted-foreground uppercase tracking-wider font-medium pt-4 border-t border-border/30 w-full justify-center">
              <span>{{ t('dataSources.officialSite') }}</span>
              <svg class="w-3 h-3 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </div>
          </div>
        </a>

        <!-- Open Meteo Card -->
        <a
          href="https://open-meteo.com"
          target="_blank"
          rel="noopener noreferrer"
          class="group relative bg-card border border-border/50 rounded-lg p-8 lg:p-10 hover:border-border transition-all duration-300 hover:shadow-lg"
          :class="{ 'opacity-0 translate-y-8': !isVisible[1] }"
        >
          <div class="flex flex-col items-center text-center space-y-8">
            <!-- Logo Container -->
            <div class="w-32 h-32 lg:w-40 lg:h-40 flex items-center justify-center bg-background border border-border/30 rounded-lg p-6 group-hover:border-border transition-colors duration-300">
              <img 
                :src="openMeteoLogo" 
                alt="Open Meteo - Weather Data API" 
                class="max-w-full max-h-full object-contain"
              />
            </div>

            <!-- Organization Name -->
            <div class="space-y-2">
              <h3 class="text-xl lg:text-2xl font-bold text-foreground tracking-tight">
                Open Meteo
              </h3>
              <p class="text-sm text-muted-foreground font-light">
                {{ t('dataSources.openMeteoDesc') }}
              </p>
            </div>

            <!-- External Link Indicator -->
            <div class="flex items-center gap-2 text-xs text-muted-foreground uppercase tracking-wider font-medium pt-4 border-t border-border/30 w-full justify-center">
              <span>{{ t('dataSources.officialSite') }}</span>
              <svg class="w-3 h-3 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </div>
          </div>
        </a>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useI18n } from '@/composables/useI18n'
import inpeLogoImg from '@/assets/inpe-logo.svg'

const { t } = useI18n()
import openMeteoLogoImg from '@/assets/open-meteo-logo.png'

const sectionRef = ref(null)
const isVisible = ref([false, false])

const inpeLogo = inpeLogoImg
const openMeteoLogo = openMeteoLogoImg

const handleScroll = () => {
  if (!sectionRef.value) return

  const section = sectionRef.value
  const rect = section.getBoundingClientRect()
  const windowHeight = window.innerHeight

  if (rect.top < windowHeight * 0.7 && rect.bottom > 0) {
    if (!isVisible.value[0]) {
      setTimeout(() => {
        isVisible.value[0] = true
      }, 100)
    }
    if (!isVisible.value[1]) {
      setTimeout(() => {
        isVisible.value[1] = true
      }, 200)
    }
  }
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true })
  handleScroll()
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>
