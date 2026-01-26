<template>
    <main
      id="hero"
      ref="mainContainer"
      @mousemove="handleMouseMove"
      class="relative w-full min-h-screen overflow-hidden bg-background"
    >
      <div class="absolute inset-0 z-0">
        <div class="absolute inset-0 z-0 opacity-[0.15] dark:opacity-[0.05]">
          <svg class="w-full h-full">
            <defs>
              <pattern
                :id="`grid-pattern-bg-${patternId}`"
                :width="gridSize"
                :height="gridSize"
                patternUnits="userSpaceOnUse"
                :x="gridOffsetX"
                :y="gridOffsetY"
              >
                <path
                  :d="`M ${gridSize} 0 L 0 0 0 ${gridSize}`"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1"
                  class="text-muted-foreground"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" :fill="`url(#grid-pattern-bg-${patternId})`" />
          </svg>
        </div>

        <div
          class="absolute inset-0 z-0 opacity-60 dark:opacity-40"
          :style="{
            maskImage: maskImageStyle,
            WebkitMaskImage: maskImageStyle
          }"
        >
          <svg class="w-full h-full">
            <defs>
              <pattern
                :id="`grid-pattern-highlight-${patternId}`"
                :width="gridSize"
                :height="gridSize"
                patternUnits="userSpaceOnUse"
                :x="gridOffsetX"
                :y="gridOffsetY"
              >
                <path
                  :d="`M ${gridSize} 0 L 0 0 0 ${gridSize}`"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1"
                  class="text-muted-foreground"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" :fill="`url(#grid-pattern-highlight-${patternId})`" />
          </svg>
        </div>
      </div>

      <div class="absolute inset-0 pointer-events-none z-0">
        <div class="absolute right-[-20%] top-[-20%] w-[40%] h-[40%] rounded-full bg-[#FA5D19]/40 dark:bg-[#FA5D19]/20 blur-[120px]" />
        <div class="absolute right-[10%] top-[-10%] w-[20%] h-[20%] rounded-full bg-[#FA5D19]/40 dark:bg-[#FA5D19]/20  blur-[100px]" />
        <div class="absolute left-[-20%] bottom-[-20%] w-[40%] h-[40%] rounded-full bg-[#159cfa]/40 dark:bg-[#159cfa]/20 blur-[120px]" />
      </div>

      <section class="overflow-hidden bg-transparent relative z-10">
        <div class="relative mx-auto max-w-10xl px-6 py-28 lg:py-24">
          <div class="relative z-10 mx-auto max-w-6xl text-center">
            <div class="inline-flex items-center gap-2 px-4 py-1.5 mb-6 rounded-full bg-[#FA5D19]/10 dark:bg-[#FA5D19]/20 border border-[#FA5D19]/20 text-sm font-medium text-[#FA5D19] animate-in fade-in slide-in-from-bottom-4 duration-700">
              <span class="relative flex h-2 w-2">
                <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FA5D19] opacity-75"></span>
                <span class="relative inline-flex rounded-full h-2 w-2 bg-[#FA5D19]"></span>
              </span>
              Monitoramento em tempo real
            </div>

            <h1 class="text-balance text-4xl font-semibold md:text-5xl lg:text-6xl mb-6 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
              Sistema Experimental para Previsão de Risco de Queimadas
            </h1>
            <p class="mx-auto my-8 max-w-2xl text-xl text-muted-foreground animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
              Plataforma baseada em dados climáticos e de sensoriamento remoto para apoio à decisão.
            </p>
            <div class="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
              <RouterLink
                to="/login"
                class="group relative inline-flex items-center justify-center px-8 py-3.5 text-base font-medium text-white bg-[#FA5D19] rounded-lg hover:bg-[#FA5D19]/90 transition-all duration-200 hover:scale-105 hover:shadow-lg hover:shadow-[#FA5D19]/25 focus:outline-none focus:ring-2 focus:ring-[#FA5D19] focus:ring-offset-2 no-underline"
              >
                Acessar demonstração
                <svg class="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </RouterLink>
              <button
                @click="scrollToFeatures"
                class="inline-flex items-center justify-center px-8 py-3.5 text-base font-medium text-foreground border border-border rounded-lg hover:bg-accent hover:border-[#FA5D19]/50 transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#FA5D19] focus:ring-offset-2"
              >
                Sobre o projeto
              </button>
            </div>

            <div class="inline-flex items-center gap-2 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-400">
              <span class="text-sm text-muted-foreground">Apoio:</span>
              <a 
                href="https://www.maritaca.ai/research" 
                target="_blank"
                class="transition-opacity hover:opacity-80"
              >
                <img
                  :src="maritacaLogo"
                  alt="Maritaca Logo"
                  class="h-14 w-auto"
                />
              </a>
            </div>
          </div>
        </div>

        <div class="mx-auto -mt-16 max-w-7xl [mask-image:linear-gradient(to_bottom,black_50%,transparent_100%)]">
          <div class="[perspective:1200px] [mask-image:linear-gradient(to_right,black_50%,transparent_100%)] -mr-16 pl-16 lg:-mr-56 lg:pl-56">
            <div class="[transform:rotateX(20deg);]">
              <div class="lg:h-[44rem] relative skew-x-[.36rad] overflow-visible">
                <div class="w-full h-full flex items-center justify-center">
                  <img
                    class="z-[2] relative border object-contain max-w-full max-h-full rounded-2xl -translate-x-8 lg:-translate-x-36"
                    :src="dashImage"
                    alt="Dashboard FlamaAI"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div class="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-b from-transparent via-background/60 via-background/90 to-background pointer-events-none z-20"></div>
    </main>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { RouterLink } from 'vue-router'
import { useGlobalStore } from '@/stores/global'
import dashImageDark from '@/assets/dash-dark.png'
import maritacaLogoDark from '@/assets/maritaca_logo_dark.svg'

const scrollToFeatures = () => {
  const element = document.querySelector('#features') || document.querySelector('.how-it-works-section')
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}

const mainContainer = ref(null)
const globalStore = useGlobalStore()

const patternId = ref(`hero-grid-${Math.random().toString(36).substr(2, 9)}`)

const dashImage = computed(() => dashImageDark)
const maritacaLogo = computed(() => maritacaLogoDark)

const gridSize = ref(40)
const gridOffsetX = ref(0)
const gridOffsetY = ref(0)
const mouseX = ref(0)
const mouseY = ref(0)

const speedX = 0.5
const speedY = 0.5

const maskImageStyle = computed(() => {
  return `radial-gradient(300px circle at ${mouseX.value}px ${mouseY.value}px, black, transparent)`
})

const handleMouseMove = (e) => {
  if (!mainContainer.value) return
  const rect = mainContainer.value.getBoundingClientRect()
  mouseX.value = e.clientX - rect.left
  mouseY.value = e.clientY - rect.top
}

let animationFrameId = null

const animateGrid = () => {
  gridOffsetX.value = (gridOffsetX.value + speedX) % gridSize.value
  gridOffsetY.value = (gridOffsetY.value + speedY) % gridSize.value
  animationFrameId = requestAnimationFrame(animateGrid)
}

onMounted(() => {
  animateGrid()
})

onUnmounted(() => {
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId)
  }
})
</script>

<style scoped>
a[href="/login"],
a[href="/login"]:hover,
a[href="/login"]:active,
a[href="/login"]:visited {
  color: white !important;
  text-decoration: none;
}
</style>

