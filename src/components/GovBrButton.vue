<template>
  <button
    type="button"
    :disabled="disabled"
    @click="$emit('click')"
    class="w-full py-4 bg-[#F8F8F8] dark:bg-secondary border-2 border-gray-200 dark:border-border hover:bg-[#D4DDED] dark:hover:bg-accent hover:border-gray-300 dark:hover:border-border font-semibold rounded-xl transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed group"
  >
    <span class="text-[#1451B4] dark:text-blue-400">Entrar com</span>
    <img :src="govbrLogo" alt="Gov.br" class="h-5 flex-shrink-0" />
  </button>
</template>

<script setup>
import govbrLogo from '@/assets/govbr.png'

defineProps({
  disabled: {
    type: Boolean,
    default: false
  }
})

defineEmits(['click'])
</script>

<style scoped>
button:active {
  transform: scale(0.98);
}
</style>
