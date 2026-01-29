<template>
  <section id="diferenciais" ref="sectionRef" class="relative py-20 lg:py-28 bg-background overflow-hidden">
    <div class="absolute inset-0 texture-dots pointer-events-none"></div>
    
    <div class="relative mx-auto max-w-7xl px-6 z-10">
      <div class="text-center mb-16">
        <div class="inline-flex items-center gap-2 mb-4 text-[#FA5D19] text-sm font-medium uppercase tracking-wider">
          <span>//</span>
          <span>{{ t('benefits.sectionLabel') }}</span>
        </div>
        <h2 class="text-3xl md:text-4xl lg:text-5xl font-semibold mb-4 text-foreground">
          {{ t('benefits.title') }}
        </h2>
        <p class="text-lg text-muted-foreground max-w-2xl mx-auto">
          {{ t('benefits.subtitle') }}
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 relative z-10 py-10 max-w-7xl mx-auto">
        <div
          v-for="(benefit, index) in benefits"
          :key="index"
            :class="cn(
            'flex flex-col py-12 md:py-14 relative group/feature benefit-item',
            'border-b md:border-b-0 lg:border-r border-border',
            (index === 0 || index === 3 || index === 6) && 'lg:border-l',
            index < 3 && 'lg:border-t',
            index < 6 && 'lg:border-b',
            { 'benefit-item-visible': isVisible[index] }
          )"
        >
          <div
            v-if="index < 3"
            class="opacity-0 group-hover/feature:opacity-100 transition duration-200 absolute inset-0 h-full w-full bg-gradient-to-t from-background/80 dark:from-card/80 to-transparent pointer-events-none"
          />
          <div
            v-if="index >= 3 && index < 6"
            class="opacity-0 group-hover/feature:opacity-100 transition duration-200 absolute inset-0 h-full w-full bg-gradient-to-b from-background/80 dark:from-card/80 to-transparent pointer-events-none"
          />
          <div
            v-if="index >= 6"
            class="opacity-0 group-hover/feature:opacity-100 transition duration-200 absolute inset-0 h-full w-full bg-gradient-to-t from-background/80 dark:from-card/80 to-transparent pointer-events-none"
          />
          <div class="mb-4 relative z-10 px-10">
            <div class="flex flex-row md:hidden items-center gap-3">
              <div class="text-neutral-600 dark:text-neutral-400 flex-shrink-0">
                <component :is="benefit.icon" :size="24" class="text-[#FA5D19]" />
              </div>
              <div class="text-lg font-bold relative z-10 flex-1">
                <span class="group-hover/feature:translate-x-2 transition duration-200 inline-block text-neutral-800 dark:text-neutral-100">
                  {{ benefit.title }}
                </span>
              </div>
            </div>
            <div class="hidden md:flex md:flex-row md:items-center gap-3">
              <div class="h-8 w-1 rounded-tr-full rounded-br-full bg-neutral-300 dark:bg-neutral-700 group-hover/feature:bg-[#FA5D19] transition-all duration-200 origin-center flex-shrink-0" />
              <div class="text-neutral-600 dark:text-neutral-400 flex-shrink-0">
                <component :is="benefit.icon" :size="24" class="text-[#FA5D19]" />
              </div>
              <div class="text-lg font-bold relative z-10 flex-1">
                <span class="group-hover/feature:translate-x-2 transition duration-200 inline-block text-neutral-800 dark:text-neutral-100">
                  {{ benefit.title }}
                </span>
              </div>
            </div>
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
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { MapPin, ShieldCheck, History, Sparkles, FileText, ChartArea } from 'lucide-vue-next'
import { cn } from '@/lib/utils'
import { useI18n } from '@/composables/useI18n'

const { t } = useI18n()
const sectionRef = ref(null)
const isVisible = ref([false, false, false, false, false, false, false])

const benefits = computed(() => [
  {
    icon: MapPin,
    title: t('benefits.benefit1Title'),
    description: t('benefits.benefit1Desc')
  },
  {
    icon: ShieldCheck,
    title: t('benefits.benefit2Title'),
    description: t('benefits.benefit2Desc')
  },
  {
    icon: History,
    title: t('benefits.benefit3Title'),
    description: t('benefits.benefit3Desc')
  },
  {
    icon: Sparkles,
    title: t('benefits.benefit4Title'),
    description: t('benefits.benefit4Desc')
  },
  {
    icon: ChartArea,
    title: t('benefits.benefit5Title'),
    description: t('benefits.benefit5Desc')
  },
  {
    icon: FileText,
    title: t('benefits.benefit6Title'),
    description: t('benefits.benefit6Desc')
  }
])

const handleScroll = () => {
  if (!sectionRef.value) return

  const section = sectionRef.value
  const rect = section.getBoundingClientRect()
  const windowHeight = window.innerHeight

  if (rect.top < windowHeight * 0.7 && rect.bottom > 0) {
    benefits.value.forEach((_, index) => {
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

