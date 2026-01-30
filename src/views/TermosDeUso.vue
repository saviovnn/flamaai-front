<template>
  <div class="min-h-screen bg-background">
    <div class="mx-auto max-w-3xl px-6 py-12">
      <RouterLink
        to="/dashboard"
        class="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-12 transition-colors"
      >
        <ArrowLeft :size="18" />
        {{ t('terms.back') }}
      </RouterLink>

      <article class="space-y-8">
        <div class="text-center">
          <h1 class="text-2xl sm:text-3xl font-semibold text-foreground">
            {{ t('terms.title') }}
          </h1>
          <p class="text-sm text-muted-foreground mt-2">
            {{ t('terms.lastUpdate') }}
          </p>
        </div>

        <div class="prose prose-sm dark:prose-invert max-w-none text-muted-foreground space-y-6 text-justify">
          <p class="text-base leading-relaxed">
            {{ t('terms.intro') }}
          </p>

          <p class="text-base leading-relaxed">
            {{ t('terms.intro2') }}
          </p>

          <section class="space-y-4">
            <h2 class="text-lg font-medium text-foreground">{{ t('terms.section1Title') }}</h2>
            <p class="text-base leading-relaxed">
              {{ t('terms.section1Text') }}
            </p>
          </section>

          <section class="space-y-4">
            <h2 class="text-lg font-medium text-foreground">{{ t('terms.section2Title') }}</h2>
            <p class="text-base leading-relaxed">
              {{ t('terms.section2Text') }}
            </p>
          </section>

          <section class="space-y-4">
            <h2 class="text-lg font-medium text-foreground">{{ t('terms.section3Title') }}</h2>
            <p class="text-base leading-relaxed">
              {{ t('terms.section3Text') }}
            </p>
          </section>

          <section class="space-y-4">
            <h2 class="text-lg font-medium text-foreground">{{ t('terms.section4Title') }}</h2>
            <p class="text-base leading-relaxed">
              {{ t('terms.section4Text') }}
            </p>
          </section>
        </div>
      </article>
    </div>
  </div>
</template>

<script setup>
import { ArrowLeft } from 'lucide-vue-next'
import { RouterLink } from 'vue-router'
import { useI18n } from '@/composables/useI18n'

const { t } = useI18n()
</script>
