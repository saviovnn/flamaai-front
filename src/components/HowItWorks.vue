<template>
  <section id="features" ref="sectionRef" class="relative py-20 lg:py-28 bg-background overflow-hidden">
    <div class="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-transparent via-background/50 to-background pointer-events-none z-0"></div>
    
    <div class="absolute inset-0 texture-dots pointer-events-none"></div>
    
    <div class="relative mx-auto max-w-7xl px-6 z-10">
      <div class="text-center mb-16">
        <div class="inline-flex items-center gap-2 mb-4 text-[#FA5D19] text-sm font-medium uppercase tracking-wider">
          <span>//</span>
          <span>Como Funciona</span>
        </div>
        <h2 class="text-3xl md:text-4xl lg:text-5xl font-semibold mb-4 text-foreground">
          Arquitetura do sistema
        </h2>
        <p class="text-lg text-muted-foreground max-w-2xl mx-auto">
          Fluxo de concepção e processamento dos dados.
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 max-w-5xl mx-auto">
        <div 
          v-for="(feature, index) in features" 
          :key="index"
          :ref="el => { if (el) featureRefs[index] = el }"
          class="flex flex-col text-left p-8 md:p-12 border-border/30 feature-item"
          :class="{
            'feature-item-visible': isVisible[index],
            'md:border-r': index === 0 || index === 2,
            'border-b md:border-b': index < 2,
            'border-b md:border-b-0': index >= 2 && index < features.length - 1
          }"
        >
          <div class="flex items-center gap-3 mb-3">
            <div class="p-2 rounded-md bg-[#FA5D19]/10 dark:bg-[#FA5D19]/20 inline-flex">
              <component :is="feature.icon" :size="20" class="text-[#FA5D19]" />
            </div>
            <h3 class="text-xl font-semibold text-foreground">
              {{ feature.title }}
            </h3>
          </div>
          
          <p class="text-muted-foreground leading-relaxed text-sm">
            {{ feature.description }}
          </p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { Database, Brain, FileText, History } from 'lucide-vue-next'

const sectionRef = ref(null)
const featureRefs = ref([])
const isVisible = ref([false, false, false, false])

const features = [
  {
    icon: Database,
    title: 'Aquisição de dados',
    description: 'Integração de dados meteorológicos e produtos de sensoriamento remoto provenientes de bases oficiais.'
  },
  {
    icon: Brain,
    title: 'Processamento e modelagem',
    description: 'Aplicação de modelos de aprendizado de máquina para estimativa de risco diário e semanal.'
  },
  {
    icon: FileText,
    title: 'Camada explicativa',
    description: 'Mecanismo baseado em recuperação de contexto para geração de explicações interpretáveis.'
  },
  {
    icon: History,
    title: 'Visualização e histórico',
    description: 'Armazenamento das análises e exibição por meio de gráficos interativos.'
  }
]

const handleScroll = () => {
  if (!sectionRef.value) return

  const section = sectionRef.value
  const rect = section.getBoundingClientRect()
  const windowHeight = window.innerHeight

  if (rect.top < windowHeight * 0.6 && rect.bottom > 0) {
    features.forEach((_, index) => {
      if (!isVisible.value[index]) {
        setTimeout(() => {
          isVisible.value[index] = true
        }, index * 150)
      }
    })
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
.feature-item {
  opacity: 0;
  transform: translateY(24px) scale(0.95);
  transition: opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1),
              transform 0.8s cubic-bezier(0.4, 0, 0.2, 1);
}

.feature-item-visible {
  opacity: 1;
  transform: translateY(0) scale(1);
}
</style>
