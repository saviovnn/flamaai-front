<template>
  <footer class="relative border-t border-border bg-card">
    <div class="mx-auto max-w-7xl px-6 py-12 lg:py-16">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 mb-8">
        <!-- Logo e frase -->
        <div class="lg:col-span-1 text-center md:text-left">
          <div class="flex items-center justify-center md:justify-start gap-2 mb-4">
            <img :src="logo" alt="FlamaAI" class="h-6 w-auto" />
            <h3 class="text-xl font-semibold text-white">FlamaAI</h3>
          </div>
          <p class="text-sm text-muted-foreground leading-relaxed mb-4">
            FlamaAI – Prevenindo incêndios, protegendo o Brasil.
          </p>
        </div>

        <!-- Links -->
        <div class="text-center md:text-left">
          <h4 class="text-sm font-semibold mb-4 text-foreground uppercase tracking-wider">Links</h4>
          <ul class="space-y-3">
            <li>
              <a href="#sobre" class="text-sm text-muted-foreground hover:text-[#FA5D19] transition-colors duration-200">
                Sobre
              </a>
            </li>
            <li>
              <a href="#funcionalidades" class="text-sm text-muted-foreground hover:text-[#FA5D19] transition-colors duration-200">
                Funcionalidades
              </a>
            </li>
            <li>
              <a href="#contato" class="text-sm text-muted-foreground hover:text-[#FA5D19] transition-colors duration-200">
                Contato
              </a>
            </li>
            <li>
              <a href="#privacidade" class="text-sm text-muted-foreground hover:text-[#FA5D19] transition-colors duration-200">
                Política de Privacidade
              </a>
            </li>
          </ul>
        </div>

        <div class="text-center md:text-left">
          <h4 class="text-sm font-semibold mb-4 text-foreground uppercase tracking-wider">Contato</h4>
          <div class="flex flex-col gap-3 items-center md:items-start">
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              class="flex items-center gap-2 text-sm text-muted-foreground hover:text-[#FA5D19] transition-colors duration-200"
              aria-label="LinkedIn"
            >
              <Linkedin :size="18" />
              <span>LinkedIn</span>
            </a>
            <a
              href="mailto:contato@flamaai.com"
              class="flex items-center gap-2 text-sm text-muted-foreground hover:text-[#FA5D19] transition-colors duration-200"
              aria-label="Email"
            >
              <Mail :size="18" />
              <span>Email</span>
            </a>
          </div>
        </div>

        <div class="text-center md:text-left">
          <h4 class="text-sm font-semibold mb-4 text-foreground uppercase tracking-wider">Legal</h4>
          <ul class="space-y-3">
            <li>
              <a href="#privacidade" class="text-sm text-muted-foreground hover:text-[#FA5D19] transition-colors duration-200">
                Privacidade
              </a>
            </li>
            <li>
              <a href="#termos" class="text-sm text-muted-foreground hover:text-[#FA5D19] transition-colors duration-200">
                Termos
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div class="pt-8 border-t border-border">
        <p class="text-sm text-center text-muted-foreground mb-2">
          © {{ currentYear }} FlamaAI. Todos os direitos reservados.
        </p>
        <p class="text-xs text-center text-muted-foreground">
          Protótipo Experimental – Uso acadêmico<br>
          Este sistema não possui finalidade comercial.<br>
          Desenvolvido para pesquisa em monitoramento ambiental e apoio à decisão.
        </p>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { computed } from 'vue'
import { Linkedin, Mail } from 'lucide-vue-next'
import { useGlobalStore } from '@/stores/global'
import logoLight from '@/assets/logo.svg'
import logoDark from '@/assets/logo-dark.svg'

const globalStore = useGlobalStore()
const currentYear = computed(() => new Date().getFullYear())
const logo = computed(() => logoDark)
</script>

<style scoped>
</style>
