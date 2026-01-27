<template>
  <section 
    id="monitoramento"
    ref="sectionRef"
    class="relative py-12 lg:py-16 overflow-hidden" 
    style="background-color: hsl(220, 13%, 10%);"
  >
    <div class="relative z-10 mx-auto max-w-7xl px-6">
      <div class="flex flex-col lg:flex-row items-center justify-between gap-12">
        <div class="flex-1 flex justify-center items-center w-full order-2 lg:order-1">
          <Globe 
            :width="400" 
            :height="350"
            :satellite-size="2"
            :satellite-distance="-3"
            :rotation="scrollRotation"
            :auto-rotate="false"
            class="max-w-full w-full"
          />
        </div>

        <div 
          class="flex-1 text-center lg:text-left order-1 lg:order-2"
          :class="{ 'opacity-0 translate-y-2': !isTextVisible }"
        >
          <div class="inline-flex items-center gap-2 mb-6 text-[#FA5D19]">
            <span>//</span>
            <span class="text-sm font-medium uppercase tracking-wider">Monitoramento</span>
          </div>
          <h4 class="text-3xl md:text-2xl lg:text-3xl font-semibold mb-6 text-white">
            Abrangência territorial
          </h4>
          <p class="text-lg text-muted-foreground">
            O sistema permite análise em escala nacional, com possibilidade de seleção por município ou coordenadas geográficas.
          </p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import Globe from '@/components/Globe.vue'
import { Satellite } from 'lucide-vue-next'

const sectionRef = ref(null)
const scrollRotation = ref([-15, 0, 0])
const isTextVisible = ref(false)

const rotationStart = [-15, 0, 0]
const rotationEnd = [53.5, 10, 0]

const handleScroll = () => {
  if (!sectionRef.value) return

  const section = sectionRef.value
  const rect = section.getBoundingClientRect()
  const windowHeight = window.innerHeight
  const windowWidth = window.innerWidth
  const sectionTop = rect.top
  
  // Detecta se é mobile (telas menores que 768px)
  const isMobile = windowWidth < 768
  
  // Em mobile, o scroll só começa quando a seção está mais próxima (50% da altura da tela)
  // Em desktop, mantém o comportamento original (100% da altura da tela)
  const scrollStart = isMobile ? windowHeight * 0.5 : windowHeight
  const scrollEnd = isMobile ? windowHeight * 0.1 : windowHeight * 0.4
  
  let progress = 0
  
  if (sectionTop <= scrollStart && sectionTop >= scrollEnd) {
    progress = (scrollStart - sectionTop) / (scrollStart - scrollEnd)
    progress = Math.max(0, Math.min(1, progress))
  } else if (sectionTop < scrollEnd) {
    progress = 1
  } else {
    progress = 0
  }
  
  const easedProgress = progress < 0.5
    ? 2 * progress * progress
    : 1 - Math.pow(-2 * progress + 2, 2) / 2
  
  scrollRotation.value = [
    rotationStart[0] + (rotationEnd[0] - rotationStart[0]) * easedProgress,
    rotationStart[1] + (rotationEnd[1] - rotationStart[1]) * easedProgress,
    rotationStart[2] + (rotationEnd[2] - rotationStart[2]) * easedProgress
  ]
  
  if (rect.top < windowHeight * 0.7 && rect.bottom > 0 && !isTextVisible.value) {
    setTimeout(() => {
      isTextVisible.value = true
    }, 300)
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
/* Animação suave e sutil para o texto - foco no globo */
.flex-1.text-center {
  transition: opacity 0.6s ease-out, transform 0.6s ease-out;
}
</style>
