<template>
  <footer class="relative border-t border-border bg-card">
    <div class="mx-auto max-w-7xl px-6 py-12 lg:py-16">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 mb-8">
        <!-- Logo e frase -->
        <div class="lg:col-span-1 text-center md:text-left">
          <div class="flex items-center justify-center md:justify-start gap-2 mb-4">
            <Logo brand class="h-6 w-auto" />
            <h3 class="text-xl font-semibold text-white">{{ t('app.name') }}</h3>
          </div>
          <p class="text-sm text-muted-foreground leading-relaxed mb-4">
            {{ t('footer.tagline') }}
          </p>
        </div>

        <!-- Links -->
        <div class="text-center md:text-left">
          <h4 class="text-sm font-semibold mb-4 text-foreground uppercase tracking-wider">{{ t('footer.links') }}</h4>
          <ul class="space-y-3">
            <li>
              <a href="#sobre" class="text-sm text-muted-foreground hover:text-[#FA5D19] transition-colors duration-200">
                {{ t('footer.about') }}
              </a>
            </li>
            <li>
              <a href="#funcionalidades" class="text-sm text-muted-foreground hover:text-[#FA5D19] transition-colors duration-200">
                {{ t('footer.features') }}
              </a>
            </li>
            <li>
              <a href="#contato" class="text-sm text-muted-foreground hover:text-[#FA5D19] transition-colors duration-200">
                {{ t('footer.contact') }}
              </a>
            </li>
            <li>
              <RouterLink to="/politica-de-privacidade" class="text-sm text-muted-foreground hover:text-[#FA5D19] transition-colors duration-200">
                {{ t('footer.privacyPolicy') }}
              </RouterLink>
            </li>
          </ul>
        </div>

        <div class="text-center md:text-left">
          <h4 class="text-sm font-semibold mb-4 text-foreground uppercase tracking-wider">{{ t('footer.contact') }}</h4>
          <div class="flex flex-col gap-3 items-center md:items-start">
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              class="flex items-center gap-2 text-sm text-muted-foreground hover:text-[#FA5D19] transition-colors duration-200"
              :aria-label="t('footer.linkedIn')"
            >
              <Linkedin :size="18" />
              <span>{{ t('footer.linkedIn') }}</span>
            </a>
            <a
              href="mailto:contato@flamaai.com"
              class="flex items-center gap-2 text-sm text-muted-foreground hover:text-[#FA5D19] transition-colors duration-200"
              :aria-label="t('footer.email')"
            >
              <Mail :size="18" />
              <span>{{ t('footer.email') }}</span>
            </a>
          </div>
        </div>

        <div class="text-center md:text-left">
          <h4 class="text-sm font-semibold mb-4 text-foreground uppercase tracking-wider">{{ t('footer.legal') }}</h4>
          <ul class="space-y-3">
            <li>
              <RouterLink to="/politica-de-privacidade" class="text-sm text-muted-foreground hover:text-[#FA5D19] transition-colors duration-200">
                {{ t('footer.privacy') }}
              </RouterLink>
            </li>
            <li>
              <RouterLink to="/termos-de-uso" class="text-sm text-muted-foreground hover:text-[#FA5D19] transition-colors duration-200">
                {{ t('footer.terms') }}
              </RouterLink>
            </li>
          </ul>
        </div>
      </div>

      <div class="pt-8 border-t border-border">
        <p class="text-sm text-center text-muted-foreground mb-2">
          © {{ currentYear }} {{ t('app.name') }}. {{ t('footer.copyright') }}
        </p>
        <p class="text-xs text-center text-muted-foreground">
          {{ t('footer.prototype') }}<br>
          {{ t('footer.noCommercial') }}<br>
          {{ t('footer.developed') }}
        </p>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { Linkedin, Mail } from 'lucide-vue-next'
import { useGlobalStore } from '@/stores/global'
import { useI18n } from '@/composables/useI18n'
import Logo from '@/components/ui/logo.vue'

const globalStore = useGlobalStore()
const { t } = useI18n()
const currentYear = computed(() => new Date().getFullYear())
</script>

<style scoped>
</style>
