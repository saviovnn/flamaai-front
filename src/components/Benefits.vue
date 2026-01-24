<template>
  <section id="diferenciais" ref="sectionRef" class="relative py-20 lg:py-28 bg-background overflow-hidden">
    <div class="absolute inset-0 texture-dots pointer-events-none"></div>
    
    <div class="relative mx-auto max-w-7xl px-6 z-10">
      <div class="text-center mb-16">
        <div class="inline-flex items-center gap-2 mb-4 text-[#FA5D19] text-sm font-medium uppercase tracking-wider">
          <span>//</span>
          <span>Diferenciais</span>
        </div>
        <h2 class="text-3xl md:text-4xl lg:text-5xl font-semibold mb-4 text-foreground">
          Por que escolher o FlamaAI
        </h2>
        <p class="text-lg text-muted-foreground max-w-2xl mx-auto">
          Para monitoramento de incêndios em todo o Brasil
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 relative z-10 py-10 max-w-7xl mx-auto">
        <div
          v-for="(benefit, index) in benefits"
          :key="index"
            :class="cn(
            'flex flex-col lg:border-r py-10 relative group/feature border-border benefit-item',
            (index === 0 || index === 4) && 'lg:border-l',
            index < 4 && 'lg:border-b',
            { 'benefit-item-visible': isVisible[index] }
          )"
        >
          <div
            v-if="index < 4"
            class="opacity-0 group-hover/feature:opacity-100 transition duration-200 absolute inset-0 h-full w-full bg-gradient-to-t from-background/80 dark:from-card/80 to-transparent pointer-events-none"
          />
          <div
            v-if="index >= 4"
            class="opacity-0 group-hover/feature:opacity-100 transition duration-200 absolute inset-0 h-full w-full bg-gradient-to-b from-background/80 dark:from-card/80 to-transparent pointer-events-none"
          />
          <div class="mb-4 relative z-10 px-10 text-neutral-600 dark:text-neutral-400">
            <component :is="benefit.icon" :size="24" class="text-[#FA5D19]" />
          </div>
          <div class="text-lg font-bold mb-2 relative z-10 px-10">
            <div class="absolute left-0 inset-y-0 h-6 group-hover/feature:h-8 w-1 rounded-tr-full rounded-br-full bg-neutral-300 dark:bg-neutral-700 group-hover/feature:bg-[#FA5D19] transition-all duration-200 origin-center" />
            <span class="group-hover/feature:translate-x-2 transition duration-200 inline-block text-neutral-800 dark:text-neutral-100">
              {{ benefit.title }}
            </span>
          </div>
          <p class="text-sm text-neutral-600 dark:text-neutral-300 max-w-xs relative z-10 px-10">
            {{ benefit.description }}
          </p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { MapPin, ShieldCheck, History, Sparkles, Database, Brain, FileText, AlertTriangle } from 'lucide-vue-next'
import { cn } from '@/lib/utils'

const sectionRef = ref(null)
const isVisible = ref([false, false, false, false, false, false, false, false])

const benefits = [
  {
    icon: MapPin,
    title: 'Cobertura nacional',
    description: 'Monitoramento completo de todas as regiões do Brasil com atualizações em tempo real.'
  },
  {
    icon: ShieldCheck,
    title: 'Dados confiáveis',
    description: 'Baseado em fontes oficiais como INPE e Open Meteo para máxima precisão.'
  },
  {
    icon: History,
    title: 'Histórico de buscas',
    description: 'Acesse e gerencie todo o histórico das suas análises anteriores de forma organizada.'
  },
  {
    icon: Sparkles,
    title: 'Tecnologia inteligente',
    description: 'Modelo RAG explicativo que não apenas prevê, mas também explica os resultados.'
  },
  {
    icon: Database,
    title: 'Dados em tempo real',
    description: 'Atualizações constantes de dados climáticos e satelitais para análises precisas.'
  },
  {
    icon: Brain,
    title: 'IA explicativa',
    description: 'Entenda o motivo por trás de cada previsão com explicações claras e detalhadas.'
  },
  {
    icon: FileText,
    title: 'Relatórios detalhados',
    description: 'Acesse relatórios completos com gráficos interativos e análises aprofundadas.'
  },
  {
    icon: AlertTriangle,
    title: 'Prevenção proativa',
    description: 'Antecipe riscos e tome medidas preventivas antes que os incêndios ocorram.'
  }
]

const handleScroll = () => {
  if (!sectionRef.value) return

  const section = sectionRef.value
  const rect = section.getBoundingClientRect()
  const windowHeight = window.innerHeight

  if (rect.top < windowHeight * 0.7 && rect.bottom > 0) {
    benefits.forEach((_, index) => {
      if (!isVisible.value[index]) {
        setTimeout(() => {
          isVisible.value[index] = true
        }, index * 180)
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
.benefit-item {
  opacity: 0;
  transform: translateY(24px) scale(0.95);
  transition: opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1),
              transform 0.8s cubic-bezier(0.4, 0, 0.2, 1);
}

.benefit-item-visible {
  opacity: 1;
  transform: translateY(0) scale(1);
}
</style>

