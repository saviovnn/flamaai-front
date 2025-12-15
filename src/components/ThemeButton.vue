<template>
  <button
    @click="$emit('click')"
    :class="[
      'flex flex-col items-center justify-center gap-2 py-4 rounded-xl border-2 transition-all',
      active 
        ? 'border-orange-500 bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400' 
        : 'border-gray-200 dark:border-border bg-white dark:bg-card text-gray-600 dark:text-muted-foreground hover:border-gray-300 dark:hover:border-border hover:bg-gray-50 dark:hover:bg-secondary'
    ]"
  >
    <slot />
    <span class="text-sm font-medium">{{ label }}</span>
  </button>
</template>

<script setup>
defineProps({
  active: {
    type: Boolean,
    default: false
  },
  label: {
    type: String,
    required: true
  }
})

defineEmits(['click'])
</script>
