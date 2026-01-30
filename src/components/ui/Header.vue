<template>
  <header
    :class="cn(
      'sticky top-0 z-50 w-full transition-all duration-300 ease-out',
      {
        'border-b border-dashed bg-white/80 backdrop-blur-md md:relative dark:bg-zinc-950/50 lg:dark:bg-transparent':
          !scrolled && !open,
        'mx-auto max-w-7xl border-b md:rounded-xl md:border md:bg-background/95 supports-[backdrop-filter]:bg-background/80 md:border-border backdrop-blur-xl md:top-4 md:max-w-6xl md:shadow-lg md:shadow-black/5 dark:md:shadow-black/20':
          scrolled && !open,
        'mx-auto max-w-7xl border-b bg-background/95 backdrop-blur-xl': open,
      }
    )"
  >
    <nav
      :class="cn(
        'flex h-14 w-full items-center justify-between md:h-12 md:transition-all md:ease-out',
        {
          'm-auto max-w-5xl px-6': !scrolled,
          'pl-6 pr-4 md:px-6': scrolled,
        }
      )"
    >
      <RouterLink to="/" aria-label="home" class="flex items-center gap-2">
        <Logo brand class="h-4 w-auto" />
        <span :class="cn('text-lg font-bold font-inter', !scrolled ? 'text-white' : 'text-foreground')">{{ t('app.name') }}</span>
      </RouterLink>
      
      <div class="hidden items-center gap-4 md:flex">
        <a
          v-for="(link, i) in links"
          :key="i"
          href="#"
          @click.prevent="scrollToSection(link.href)"
          :class="cn(
            buttonVariants({ variant: 'ghost' }), 
            'px-3 py-2 relative group transition-colors duration-200 cursor-pointer',
            !scrolled ? 'text-white hover:bg-white/10' : 'text-foreground hover:text-[#FA5D19]'
          )"
        >
          {{ link.label }}
          <span class="absolute bottom-0 left-0 w-0 h-0.5 bg-[#FA5D19] group-hover:w-full transition-all duration-300"></span>
        </a>
        <RouterLink
          to="/login"
          :class="cn(
            'group inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FA5D19] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-9 px-4 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white hover:text-white no-underline'
          )"
        >
          {{ t('header.accessDemo') }}
          <svg class="ml-1.5 w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </RouterLink>
      </div>
      
      <button
        @click="open = !open"
        class="md:hidden inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 w-10 relative z-50 text-foreground"
        aria-label="Toggle menu"
        :aria-expanded="open"
      >
        <span class="sr-only">{{ t('header.menu') }}</span>
        <div class="flex flex-col items-center justify-center w-5 h-5 space-y-1.5">
          <span
            :class="[
              'block w-5 h-0.5 bg-current transition-all duration-300 ease-in-out origin-center',
              open ? 'rotate-45 translate-y-2' : ''
            ]"
          ></span>
          <span
            :class="[
              'block w-5 h-0.5 bg-current transition-all duration-300 ease-in-out',
              open ? 'opacity-0' : 'opacity-100'
            ]"
          ></span>
          <span
            :class="[
              'block w-5 h-0.5 bg-current transition-all duration-300 ease-in-out origin-center',
              open ? '-rotate-45 -translate-y-2' : ''
            ]"
          ></span>
        </div>
      </button>
    </nav>

    <!-- Menu Mobile Dropdown -->
    <Transition
      enter-active-class="transition ease-out duration-200"
      enter-from-class="opacity-0 -translate-y-2"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition ease-in duration-150"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-2"
    >
      <div
        v-if="open"
        :class="cn(
          'fixed left-0 right-0 top-14 bottom-0 z-[9999] border-b border-border shadow-lg md:hidden',
          scrolled 
            ? 'bg-background/95 backdrop-blur-xl' 
            : 'bg-background/95 backdrop-blur-xl',
          !scrolled ? 'bg-white/80 backdrop-blur-md dark:bg-zinc-950/50' : 'bg-background/95 backdrop-blur-xl'
        )"
        style="height: calc(100vh - 3.5rem);"
      >
        <div class="flex h-full flex-col overflow-y-auto">
          <!-- Itens de navegação em cima -->
          <div class="flex flex-col gap-1 p-4 flex-1">
            <a
              v-for="link in links"
              :key="link.label"
              href="#"
              @click.prevent="handleMenuClick(link.href)"
              class="inline-flex items-center justify-start whitespace-nowrap rounded-md text-base font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 px-4 py-3 hover:bg-accent hover:text-accent-foreground text-foreground active:bg-accent/80"
            >
              {{ link.label }}
            </a>
          </div>
          
          <!-- Botão Acessar demonstração embaixo -->
          <div class="p-4 pt-2 border-t border-border mt-auto">
            <RouterLink
              to="/login"
              class="w-full inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FA5D19] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 px-4 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white hover:text-white no-underline"
              @click="open = false"
            >
              {{ t('header.accessDemo') }}
              <svg class="ml-1.5 w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </RouterLink>
          </div>
        </div>
      </div>
    </Transition>
  </header>
</template>

<script setup>
import { ref, computed, watch, onUnmounted } from 'vue'
import { RouterLink } from 'vue-router'
import { cn } from '@/lib/utils'
import { useScroll } from '@/composables/useScroll'
import { useGlobalStore } from '@/stores/global'
import { useI18n } from '@/composables/useI18n'
import Logo from '@/components/ui/logo.vue'

const globalStore = useGlobalStore()
const open = ref(false)
const scrolled = useScroll(10)

const { t } = useI18n()
const links = computed(() => [
  { label: t('header.howItWorks'), href: '#features' },
  { label: t('header.monitoring'), href: '#monitoramento' },
  { label: t('header.benefits'), href: '#diferenciais' },
  { label: t('header.dataSources'), href: '#fontes-dados' },
  { label: t('header.faq'), href: '#faq' },
])

const scrollToSection = (sectionId) => {
  const element = document.querySelector(sectionId)
  if (element) {
    const headerOffset = 80
    const elementPosition = element.getBoundingClientRect().top
    const offsetPosition = elementPosition + window.pageYOffset - headerOffset

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    })
  }
}

const handleMenuClick = (sectionId) => {
  open.value = false
  // Pequeno delay para garantir que o menu feche antes de rolar
  setTimeout(() => {
    scrollToSection(sectionId)
  }, 100)
}

// Button variants helper
const buttonVariants = ({ variant = 'default', className = '' }) => {
  const baseClasses = 'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50'
  
  const variantClasses = {
    default: 'bg-primary text-primary-foreground hover:bg-primary/90',
    destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
    outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
    secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
    ghost: 'hover:bg-accent hover:text-accent-foreground',
    link: 'text-primary underline-offset-4 hover:underline'
  }
  
  return cn(baseClasses, variantClasses[variant], className)
}

watch(open, (isOpen) => {
  if (isOpen) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
  }
})

onUnmounted(() => {
  document.body.style.overflow = ''
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

a[href="/login"]:active {
  transform: scale(0.98);
}
</style>

