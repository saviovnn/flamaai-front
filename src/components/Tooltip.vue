<template>
  <div class="relative inline-block">
    <div 
      @mouseenter="showTooltip = true"
      @mouseleave="showTooltip = false"
    >
      <slot />
    </div>
    
    <Transition name="tooltip">
      <div
        v-if="showTooltip"
        :class="[
          'absolute z-50 px-2 py-1 text-xs text-white bg-gray-800 dark:bg-gray-700 rounded-lg whitespace-nowrap pointer-events-none',
          positionClasses
        ]"
      >
        {{ text }}
        <div 
          :class="[
            'absolute w-2 h-2 bg-gray-700 dark:bg-gray-600 transform rotate-45',
            arrowClasses
          ]"
        />
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  text: {
    type: String,
    required: true
  },
  position: {
    type: String,
    default: 'bottom',
    validator: (value) => ['top', 'bottom', 'left', 'right'].includes(value)
  }
})

const showTooltip = ref(false)

const positionClasses = computed(() => {
  const positions = {
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2'
  }
  return positions[props.position]
})

const arrowClasses = computed(() => {
  const arrows = {
    bottom: '-top-1 left-1/2 -translate-x-1/2',
    top: '-bottom-1 left-1/2 -translate-x-1/2',
    left: '-right-1 top-1/2 -translate-y-1/2',
    right: '-left-1 top-1/2 -translate-y-1/2'
  }
  return arrows[props.position]
})
</script>

<style scoped>
.tooltip-enter-active,
.tooltip-leave-active {
  transition: opacity 0.15s ease;
}

.tooltip-enter-from,
.tooltip-leave-to {
  opacity: 0;
}
</style>
