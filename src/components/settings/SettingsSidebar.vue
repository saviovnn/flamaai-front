<template>
  <div class="w-full sm:w-48 border-b sm:border-b-0 sm:border-r border-gray-200 dark:border-border p-3 sm:p-4 flex flex-col gap-1">
    <div class="flex items-center justify-between mb-3 sm:mb-4">
      <h2 class="text-base sm:text-lg font-semibold text-gray-900 dark:text-foreground">
        {{ title }}
      </h2>
      <button
        @click="$emit('close')"
        class="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-accent transition-colors text-gray-500 dark:text-muted-foreground sm:hidden"
      >
        <X :size="18" />
      </button>
    </div>

    <div class="flex flex-row sm:flex-col gap-1 overflow-x-auto sm:overflow-x-visible">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        @click="$emit('update:activeTab', tab.id)"
        :class="[
          'flex items-center gap-2 sm:gap-3 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm transition-colors text-left whitespace-nowrap',
          activeTab === tab.id
            ? 'bg-gray-100 dark:bg-accent text-gray-900 dark:text-foreground font-medium'
            : 'text-gray-600 dark:text-muted-foreground hover:bg-gray-50 dark:hover:bg-secondary'
        ]"
      >
        <component :is="tab.icon" :size="16" class="sm:w-[18px] sm:h-[18px]" />
        {{ tab.label }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { X } from 'lucide-vue-next'

defineProps({
  title: {
    type: String,
    required: true
  },
  tabs: {
    type: Array,
    required: true
  },
  activeTab: {
    type: String,
    required: true
  }
})

defineEmits(['close', 'update:activeTab'])
</script>
