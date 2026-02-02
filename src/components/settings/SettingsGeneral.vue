<template>
  <div>
    <div class="mb-4 sm:mb-6 mt-0 sm:mt-4">
      <h3 class="text-xs sm:text-sm font-medium text-gray-700 dark:text-muted-foreground mb-2 sm:mb-3">
        {{ t('settings.theme') }}
      </h3>
      <div class="flex flex-col sm:flex-row gap-2 sm:gap-3">
        <ThemeButton
          :active="theme === 'light'"
          @click="$emit('setTheme', 'light')"
          :label="t('settings.themeLight')"
          class="w-full sm:flex-1"
        >
          <Sun :size="18" class="sm:w-5 sm:h-5" />
        </ThemeButton>

        <ThemeButton
          :active="theme === 'dark'"
          @click="$emit('setTheme', 'dark')"
          :label="t('settings.themeDark')"
          class="w-full sm:flex-1"
        >
          <Moon :size="18" class="sm:w-5 sm:h-5" />
        </ThemeButton>

        <ThemeButton
          :active="theme === 'system'"
          @click="$emit('setTheme', 'system')"
          :label="t('settings.themeSystem')"
          class="w-full sm:flex-1"
        >
          <Monitor :size="18" class="sm:w-5 sm:h-5" />
        </ThemeButton>
      </div>
    </div>

    <div class="mb-4 sm:mb-6">
      <h3 class="text-xs sm:text-sm font-medium text-gray-700 dark:text-muted-foreground mb-2 sm:mb-3">
        {{ t('settings.language') }}
      </h3>
      <div class="flex flex-col sm:flex-row gap-2 sm:gap-3">
        <ThemeButton
          :active="locale === 'pt'"
          @click="$emit('setLocale', 'pt')"
          :label="t('settings.languagePt')"
          class="w-full sm:flex-1"
        >
          <Languages :size="18" class="sm:w-5 sm:h-5" />
        </ThemeButton>

        <ThemeButton
          :active="locale === 'en'"
          @click="$emit('setLocale', 'en')"
          :label="t('settings.languageEn')"
          class="w-full sm:flex-1"
        >
          <Languages :size="18" class="sm:w-5 sm:h-5" />
        </ThemeButton>

        <ThemeButton
          :active="locale === 'es'"
          @click="$emit('setLocale', 'es')"
          :label="t('settings.languageEs')"
          class="w-full sm:flex-1"
        >
          <Languages :size="18" class="sm:w-5 sm:h-5" />
        </ThemeButton>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Sun, Moon, Monitor, Languages } from 'lucide-vue-next'
import { useI18n } from '@/composables/useI18n'
import ThemeButton from '@/components/ThemeButton.vue'

defineProps({
  theme: {
    type: String,
    required: true
  },
  locale: {
    type: String,
    required: true
  }
})

defineEmits(['setTheme', 'setLocale'])

const { t } = useI18n()
</script>
