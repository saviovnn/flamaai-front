import { computed } from 'vue'
import { useGlobalStore } from '@/stores/global'
import { messages } from '@/i18n/messages'

/**
 * Composable para internacionalização.
 * Retorna t(key) que resolve chaves no formato 'settings.theme' para o locale atual.
 */
export function useI18n() {
  const globalStore = useGlobalStore()

  const locale = computed(() => globalStore.locale)

  function t(key) {
    const keys = key.split('.')
    let value = messages[locale.value]
    for (const k of keys) {
      value = value?.[k]
    }
    return value ?? key
  }

  return { t, locale }
}
