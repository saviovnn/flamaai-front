<template>
  <div class="flex justify-center mb-8">
    <div class="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg relative">
      <Flame :size="40" class="text-white" />
      <Sparkle :size="10" class="text-white fill-white absolute top-3 right-3" fill="currentColor" />
    </div>
  </div>
</template>

<script setup>
import { Flame, Sparkle } from 'lucide-vue-next'
</script>
