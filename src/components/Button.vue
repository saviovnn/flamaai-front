<template>
  <button
    :type="type"
    :disabled="disabled"
    @click="$emit('click')"
    :class="[
      'w-full py-4 font-semibold rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed',
      variantClasses
    ]"
  >
    <span v-if="!loading">
      <slot />
    </span>
    <span v-else class="flex items-center justify-center gap-2">
      <svg class="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      {{ loadingText }}
    </span>
  </button>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  type: {
    type: String,
    default: 'button'
  },
  variant: {
    type: String,
    default: 'primary',
    validator: (value) => ['primary', 'secondary', 'outline'].includes(value)
  },
  loading: {
    type: Boolean,
    default: false
  },
  loadingText: {
    type: String,
    default: 'Carregando...'
  },
  disabled: {
    type: Boolean,
    default: false
  }
})

defineEmits(['click'])

const variantClasses = computed(() => {
  const variants = {
    primary: 'bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-lg shadow-orange-500/30',
    secondary: 'bg-gray-100 dark:bg-secondary hover:bg-gray-200 dark:hover:bg-accent text-gray-900 dark:text-foreground',
    outline: 'bg-white dark:bg-card border-2 border-gray-200 dark:border-border hover:bg-gray-50 dark:hover:bg-secondary hover:border-gray-300 dark:hover:border-border text-gray-900 dark:text-foreground'
  }
  return variants[props.variant]
})
</script>

<style scoped>
button:active {
  transform: scale(0.98);
}
</style>
