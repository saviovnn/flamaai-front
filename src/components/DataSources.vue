<template>
  <section id="fontes-dados" ref="sectionRef" class="relative py-20 lg:py-28 bg-muted/30 overflow-visible">
    <div class="relative mx-auto max-w-7xl px-6">
      <div class="text-center mb-16">
        <div class="inline-flex items-center gap-2 mb-4 text-[#FA5D19] text-sm font-medium uppercase tracking-wider">
          <span>//</span>
          <span>Fontes de Dados</span>
        </div>
        <h2 class="text-3xl md:text-4xl lg:text-5xl font-semibold mb-4 text-foreground">
          Dados confiáveis para previsões precisas
        </h2>
        <p class="text-lg text-muted-foreground max-w-2xl mx-auto">
          FlamaAI utiliza dados oficiais e atualizados de fontes confiáveis, processados por nosso modelo de inteligência artificial para análises precisas e explicativas.
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 max-w-5xl mx-auto">
        <a
          href="https://www.gov.br/inpe/pt-br"
          target="_blank"
          rel="noopener noreferrer"
          class="group bg-card border border-border rounded-2xl p-6 lg:p-8 hover:border-[#159cfa]/50 hover:shadow-xl hover:shadow-[#159cfa]/10 transition-all duration-300 hover:-translate-y-1 relative overflow-visible block"
          :class="{ 'opacity-0 translate-y-4': !isVisible[0] }"
        >
          <div class="absolute top-0 right-0 w-40 h-40 bg-[#159cfa]/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          
          <div class="relative z-10 flex flex-col gap-5 h-full">
            <div class="flex items-start justify-between gap-4">
              <div class="flex items-start gap-4 flex-1 min-w-0">
                <div class="flex-shrink-0">
                  <div class="bg-background border border-border rounded-xl p-3 lg:p-4 flex items-center justify-center group-hover:border-[#159cfa]/50 group-hover:shadow-md group-hover:scale-105 transition-all duration-300 w-16 h-16 lg:w-20 lg:h-20">
                    <img 
                      :src="inpeLogo" 
                      alt="INPE Logo" 
                      class="h-10 lg:h-12 w-auto object-contain"
                    />
                  </div>
                </div>
                
                <!-- Nome -->
                <div class="flex-1 min-w-0">
                  <h3 
                    class="text-lg lg:text-xl font-semibold text-foreground group-hover:text-[#159cfa] transition-colors leading-tight relative inline-block tooltip-trigger"
                    title="Instituto Nacional de Pesquisas Espaciais"
                  >
                    INPE
                    <span class="tooltip-text">Instituto Nacional de Pesquisas Espaciais</span>
                  </h3>
                </div>
              </div>
              
              <div class="flex-shrink-0">
                <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#159cfa]/10 border border-[#159cfa]/20">
                  <div class="w-2 h-2 rounded-full bg-[#159cfa]"></div>
                  <span class="text-xs font-medium text-[#159cfa] uppercase tracking-wider">Dados Oficiais</span>
                </div>
              </div>
            </div>

            <div class="flex-1">
              <p class="text-muted-foreground leading-relaxed text-sm lg:text-base">
                Dados de satélite e monitoramento ambiental para análise de queimadas e riscos de incêndio em todo o Brasil.
              </p>
            </div>

            <div class="flex items-center gap-2 text-sm lg:text-base text-[#159cfa] font-medium group-hover:gap-3 transition-all w-fit pt-2 border-t border-border/50">
              <span>Visitar site oficial</span>
              <svg class="w-4 h-4 lg:w-5 lg:h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </div>
          </div>
        </a>

        <a
          href="https://open-meteo.com"
          target="_blank"
          rel="noopener noreferrer"
          class="group bg-card border border-border rounded-2xl p-6 lg:p-8 hover:border-[#FA5D19]/50 hover:shadow-xl hover:shadow-[#FA5D19]/10 transition-all duration-300 hover:-translate-y-1 relative overflow-visible block"
          :class="{ 'opacity-0 translate-y-4': !isVisible[1] }"
        >
          <div class="absolute top-0 right-0 w-40 h-40 bg-[#FA5D19]/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          
          <div class="relative z-10 flex flex-col gap-5 h-full">
            <div class="flex items-start justify-between gap-4">
              <div class="flex items-start gap-4 flex-1 min-w-0">
                <div class="flex-shrink-0">
                  <div class="bg-background border border-border rounded-xl p-3 lg:p-4 flex items-center justify-center group-hover:border-[#FA5D19]/50 group-hover:shadow-md group-hover:scale-105 transition-all duration-300 w-16 h-16 lg:w-20 lg:h-20">
                    <img 
                      :src="openMeteoLogo" 
                      alt="Open Meteo Logo" 
                      class="h-10 lg:h-12 w-auto object-contain"
                    />
                  </div>
                </div>
                
                <div class="flex-1 min-w-0">
                  <h3 class="text-lg lg:text-xl font-semibold text-foreground group-hover:text-[#FA5D19] transition-colors leading-tight">
                    Open Meteo
                  </h3>
                </div>
              </div>
              
              <div class="flex-shrink-0">
                <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#FA5D19]/10 border border-[#FA5D19]/20">
                  <div class="w-2 h-2 rounded-full bg-[#FA5D19]"></div>
                  <span class="text-xs font-medium text-[#FA5D19] uppercase tracking-wider">Tempo Real</span>
                </div>
              </div>
            </div>

            <!-- Descrição -->
            <div class="flex-1">
              <p class="text-muted-foreground leading-relaxed text-sm lg:text-base">
                Dados meteorológicos globais em tempo real, incluindo temperatura, umidade, vento e condições climáticas históricas.
              </p>
            </div>

            <div class="flex items-center gap-2 text-sm lg:text-base text-[#FA5D19] font-medium group-hover:gap-3 transition-all w-fit pt-2 border-t border-border/50">
              <span>Visitar site oficial</span>
              <svg class="w-4 h-4 lg:w-5 lg:h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
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
import inpeLogoImg from '@/assets/inpe-logo.svg'
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

  if (rect.top < windowHeight * 0.5 && rect.bottom > 0) {
    if (!isVisible.value[0]) {
      setTimeout(() => {
        isVisible.value[0] = true
      }, 100)
    }
    if (!isVisible.value[1]) {
      setTimeout(() => {
        isVisible.value[1] = true
      }, 250)
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

<style scoped>
.tooltip-trigger {
  position: relative;
}

.tooltip-text {
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%) translateY(-8px);
  background-color: hsl(var(--foreground));
  color: hsl(var(--background));
  padding: 8px 12px;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 500;
  white-space: nowrap;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.2s ease, transform 0.2s ease;
  z-index: 100;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  margin-bottom: 8px;
}

.tooltip-text::after {
  content: '';
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  border: 6px solid transparent;
  border-top-color: hsl(var(--foreground));
}

.tooltip-trigger:hover .tooltip-text {
  opacity: 1;
  transform: translateX(-50%) translateY(0);
  pointer-events: auto;
}
</style>
