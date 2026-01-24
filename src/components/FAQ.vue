<template>
  <section id="faq" ref="sectionRef" class="relative py-20 lg:py-28 bg-background overflow-hidden">
    <div class="relative mx-auto max-w-4xl px-6">
      <div class="text-center mb-16">
        <div class="inline-flex items-center gap-2 mb-4 text-[#FA5D19] text-sm font-medium uppercase tracking-wider">
          <span>//</span>
          <span>FAQ</span>
        </div>
        <h2 class="text-3xl md:text-4xl lg:text-5xl font-semibold mb-4 text-foreground">
          FAQ
        </h2>
        <p class="text-lg text-muted-foreground max-w-2xl mx-auto">
          Esclarecimentos sobre o funcionamento e os limites do protótipo
        </p>
      </div>

      <div class="space-y-4">
        <div
          v-for="(item, index) in faqItems"
          :key="index"
          class="group border border-border rounded-xl bg-card overflow-hidden transition-all duration-300 hover:border-[#FA5D19]/50 hover:shadow-lg hover:shadow-[#FA5D19]/5"
        >
          <button
            @click="toggleItem(index)"
            class="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-accent/50 transition-colors duration-300 ease-in-out group-hover:bg-accent/30"
          >
            <span class="font-semibold text-foreground pr-4 group-hover:text-[#FA5D19] transition-colors duration-300 ease-in-out">{{ item.question }}</span>
            <ChevronDown
              :class="[
                'flex-shrink-0 text-muted-foreground transition-all duration-400 ease-[cubic-bezier(0.4,0,0.2,1)]',
                openItems[index] ? 'rotate-180 text-[#FA5D19]' : 'group-hover:text-[#FA5D19]'
              ]"
              :size="20"
            />
          </button>
          <Transition
            name="faq"
            @enter="onEnter"
            @after-enter="onAfterEnter"
            @leave="onLeave"
            @after-leave="onAfterLeave"
          >
            <div v-if="openItems[index]" class="faq-content px-6 pb-5 border-t border-border/50 overflow-hidden">
              <p class="text-muted-foreground leading-relaxed pt-4">
                {{ item.answer }}
              </p>
            </div>
          </Transition>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { ChevronDown } from 'lucide-vue-next'

const sectionRef = ref(null)
const openItems = ref({})

const faqItems = [
  {
    question: 'O que é este sistema?',
    answer: 'Um protótipo experimental desenvolvido para fins de pesquisa e avaliação.'
  },
  {
    question: 'Como o risco é estimado?',
    answer: 'Por meio de modelos supervisionados treinados com dados históricos climáticos e ambientais.'
  },
  {
    question: 'Qual a área de cobertura?',
    answer: 'Todo o território nacional.'
  },
  {
    question: 'Este sistema é um produto comercial?',
    answer: 'Não. Trata-se de um protótipo de pesquisa.'
  },
  {
    question: 'Os resultados são determinísticos?',
    answer: 'Não. As estimativas são probabilísticas e dependem da qualidade dos dados.'
  },
  {
  question: 'A MaritacaAI fornece o risco de fogo?',
  answer: 'Não. A MaritacaAI não participa do processo de estimativa do risco. O sistema utiliza um modelo de linguagem (Sabiá), por meio de créditos concedidos pela MaritacaAI, exclusivamente para a geração de explicações textuais (camada RAG) sobre os resultados previamente calculados pelo modelo de previsão.'
}

];


const toggleItem = (index) => {
  openItems.value[index] = !openItems.value[index]
}

const onEnter = (el) => {
  el.style.height = '0'
  el.style.opacity = '0'
  el.style.overflow = 'hidden'
  requestAnimationFrame(() => {
    const height = el.scrollHeight
    el.style.transition = 'height 400ms cubic-bezier(0.4, 0, 0.2, 1), opacity 400ms cubic-bezier(0.4, 0, 0.2, 1)'
    el.style.height = `${height}px`
    el.style.opacity = '1'
  })
}

const onAfterEnter = (el) => {
  el.style.height = 'auto'
  el.style.overflow = 'visible'
}

const onLeave = (el) => {
  el.style.height = `${el.scrollHeight}px`
  el.style.opacity = '1'
  el.style.overflow = 'hidden'
  requestAnimationFrame(() => {
    el.style.transition = 'height 350ms cubic-bezier(0.4, 0, 0.2, 1), opacity 350ms cubic-bezier(0.4, 0, 0.2, 1)'
    el.style.height = '0'
    el.style.opacity = '0'
  })
}

const onAfterLeave = (el) => {
  el.style.height = ''
  el.style.opacity = ''
  el.style.overflow = ''
  el.style.transition = ''
}
</script>

<style scoped>
.faq-content {
  will-change: height, opacity;
}

.faq-enter-active,
.faq-leave-active {
  transition: height 400ms cubic-bezier(0.4, 0, 0.2, 1),
              opacity 400ms cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
}

.faq-enter-from,
.faq-leave-to {
  height: 0 !important;
  opacity: 0;
}

.faq-enter-to,
.faq-leave-from {
  opacity: 1;
}
</style>
