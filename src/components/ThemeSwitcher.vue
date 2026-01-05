<template>
  <div
    @click="handleToggle"
    class="theme-switcher"
    :aria-label="isDark ? 'Alternar para tema claro' : 'Alternar para tema escuro'"
    role="button"
    tabindex="0"
    @keydown.enter="handleToggle"
    @keydown.space.prevent="handleToggle"
  >
    <Transition name="icon-fade" mode="out-in">
      <Sun v-if="isDark" :size="18" key="sun" class="sm:w-5 sm:h-5 text-gray-900 dark:text-foreground" />
      <Moon v-else :size="18" key="moon" class="sm:w-5 sm:h-5 text-gray-900 dark:text-foreground" />
    </Transition>
  </div>
</template>

<script setup>
import { computed, markRaw } from 'vue'
import { Sun as SunIcon, Moon as MoonIcon } from 'lucide-vue-next'
import { useGlobalStore } from '@/stores/global'

const globalStore = useGlobalStore()

const Sun = markRaw(SunIcon)
const Moon = markRaw(MoonIcon)

const isDark = computed(() => globalStore.isDark)

const handleToggle = () => {
  const currentTheme = globalStore.theme
  if (currentTheme === 'system') {
    // Se está em system, alterna baseado no tema efetivo
    globalStore.setTheme(globalStore.isDark ? 'light' : 'dark')
  } else {
    // Alterna entre light e dark
    globalStore.setTheme(currentTheme === 'light' ? 'dark' : 'light')
  }
}
</script>

<style scoped>
.theme-switcher {
  position: absolute;
  top: 1.5rem;
  right: 1.5rem;
  z-index: 20;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 0.5rem;
  border: 2px solid hsl(var(--border));
  background: hsl(var(--card));
  color: hsl(var(--foreground));
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.theme-switcher:hover {
  background: hsl(var(--accent));
  border-color: hsl(var(--ring));
  transform: scale(1.05);
}

.theme-switcher:active {
  transform: scale(0.95);
}

.theme-switcher:focus {
  outline: 2px solid hsl(var(--ring));
  outline-offset: 2px;
}

.dark .theme-switcher {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.icon-fade-enter-active,
.icon-fade-leave-active {
  transition: all 0.2s ease;
}

.icon-fade-enter-from {
  opacity: 0;
  transform: scale(0.8) rotate(-90deg);
}

.icon-fade-leave-to {
  opacity: 0;
  transform: scale(0.8) rotate(90deg);
}
</style>

