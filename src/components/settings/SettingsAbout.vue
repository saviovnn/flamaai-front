<template>
  <div class="space-y-0">
    <div class="flex items-center justify-between py-3 sm:py-4 border-b border-gray-100 dark:border-border">
      <span class="text-xs sm:text-sm text-gray-700 dark:text-muted-foreground">{{ t('settings.termsOfUse') }}</span>
      <button
        @click="$emit('openTerms')"
        class="px-3 sm:px-4 py-1.5 text-xs sm:text-sm text-gray-700 dark:text-muted-foreground border border-gray-300 dark:border-border rounded-full hover:bg-gray-50 dark:hover:bg-secondary transition-colors"
      >
        {{ t('settings.view') }}
      </button>
    </div>

    <div class="flex items-center justify-between py-3 sm:py-4">
      <span class="text-xs sm:text-sm text-gray-700 dark:text-muted-foreground">{{ t('settings.privacyPolicy') }}</span>
      <button
        @click="$emit('openPrivacy')"
        class="px-3 sm:px-4 py-1.5 text-xs sm:text-sm text-gray-700 dark:text-muted-foreground border border-gray-300 dark:border-border rounded-full hover:bg-gray-50 dark:hover:bg-secondary transition-colors"
      >
        {{ t('settings.view') }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { useI18n } from '@/composables/useI18n'

defineEmits(['openTerms', 'openPrivacy'])

const { t } = useI18n()
</script>
