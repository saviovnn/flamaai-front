<template>
  <div>
    <div class="h-6 mb-2">
      <label v-if="label" class="block text-gray-700 dark:text-muted-foreground text-sm font-medium">
        {{ label }}
      </label>
    </div>
    <div class="relative">
      <input
        :type="computedType"
        :placeholder="placeholder"
        :value="modelValue"
        :disabled="disabled"
        @input="$emit('update:modelValue', $event.target.value)"
        :class="[
          'w-full px-4 py-3.5 bg-white dark:bg-card border-2 rounded-xl text-gray-900 dark:text-foreground placeholder:text-gray-400 dark:placeholder:text-muted-foreground focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed',
          secret ? 'pr-12' : '',
          error ? 'border-red-500 focus:border-red-500' : 'border-gray-200 dark:border-border focus:border-orange-500'
        ]"
      />
      <button
        v-if="secret"
        type="button"
        @click="togglePasswordVisibility"
        tabindex="-1"
        class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-muted-foreground hover:text-orange-500"
      >
        <Transition name="eye-fade" mode="out-in">
          <Eye v-if="!showPassword" :size="20" key="eye-closed" class="eye-transition" />
          <EyeOff v-else :size="20" key="eye-open" class="eye-transition" />
        </Transition>
      </button>
    </div>
    <Transition name="error-fade">
      <p v-if="error" class="mt-2 text-sm text-red-600">
        {{ error }}
      </p>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { Eye, EyeOff } from 'lucide-vue-next'

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  label: {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: ''
  },
  type: {
    type: String,
    default: 'text'
  },
  secret: {
    type: Boolean,
    default: false
  },
  disabled: {
    type: Boolean,
    default: false
  },
  error: {
    type: String,
    default: ''
  }
})

defineEmits(['update:modelValue'])

const showPassword = ref(false)

const computedType = computed(() => {
  if (props.secret) {
    return showPassword.value ? 'text' : 'password'
  }
  return props.type
})

const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value
}
</script>

<style scoped>
.eye-fade-enter-active,
.eye-fade-leave-active {
  transition: all 0.2s ease;
}

.eye-fade-enter-from {
  opacity: 0;
  transform: scale(0.8);
}

.eye-fade-leave-to {
  opacity: 0;
  transform: scale(0.8);
}

.eye-transition {
  transition: all 0.2s ease;
}

.error-fade-enter-active,
.error-fade-leave-active {
  transition: all 0.2s ease;
}

.error-fade-enter-from {
  opacity: 0;
  transform: translateY(-4px);
}

.error-fade-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>
