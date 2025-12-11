<template>
  <button
    @click="$emit('click')"
    :class="[
      'flex flex-col items-center justify-center gap-2 py-4 rounded-xl border-2 transition-all',
      active 
        ? 'border-orange-500 bg-orange-50 text-orange-600' 
        : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50'
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
