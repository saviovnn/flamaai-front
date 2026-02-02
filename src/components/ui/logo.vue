<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 338 387"
    fill="none"
    class="flex-shrink-0"
    :class="$attrs.class"
    aria-label="FlamaAI"
  >
    <path
      d="M61.3469 147.919C66.5479 138.251 71.4522 128.409 76.9974 118.942C116.223 51.9763 174.89 13.4524 250.939 0.558899C253.818 0.0707399 256.805 0.218995 261.141 0C261.141 4.16125 261.161 7.67767 261.138 11.1939C260.991 33.5779 265.146 55.0029 276.424 74.5444C286.405 91.8397 296.791 108.909 307.314 125.882C318.237 143.502 328.836 161.352 333.056 181.876C345.95 244.587 328.633 298.626 281.596 341.226C232.674 385.533 174.672 397.749 112.325 375.661C49.5788 353.431 12.8025 307.06 2.13518 241.447C-4.40132 201.242 4.24468 163.265 25.6736 128.417C26.544 127.002 27.5156 125.643 28.5173 124.317C28.9058 123.802 29.509 123.449 30.952 122.232C39.1774 130.544 47.4917 138.946 56.6822 148.28C59.4282 150.561 60.8002 150.451 61.3469 147.919ZM43.2946 236.268C53.8473 305.912 119.719 354.973 191.19 342.072C249.616 331.526 294.618 278.911 295.501 219.682C295.823 198.005 289.883 178.139 279.206 159.683C270.706 144.989 261.268 130.836 252.177 116.486C239.804 96.9542 228.967 76.7795 225.043 53.5957C224.789 52.0974 223.765 50.7295 222.756 48.5643C204.269 54.8976 187.434 63.3387 171.597 73.8782C132.266 100.053 108.312 137.651 92.8888 182.466C80.5166 172.89 71.7192 161.535 59.7237 152.604C44.4241 178.937 39.4513 205.836 43.2946 236.268Z"
      :fill="colors.borda"
    />
    <path
      d="M43.1979 235.389C39.4513 205.836 44.4241 178.937 59.7236 152.605C71.7191 161.535 80.5166 172.89 92.8888 182.466C108.312 137.651 132.266 100.054 171.597 73.8783C187.434 63.3388 204.269 54.8977 222.756 48.5645C223.765 50.7296 224.789 52.0975 225.043 53.5958C228.967 76.7796 239.803 96.9543 252.177 116.486C261.268 130.836 270.706 144.99 279.206 159.683C289.883 178.139 295.823 198.005 295.501 219.682C294.618 278.912 249.616 331.526 191.19 342.072C119.719 354.973 53.8473 305.912 43.1979 235.389Z"
      :fill="colors.dentro"
    />
  </svg>
</template>

<script setup>
import { computed } from 'vue'
import { useGlobalStore } from '@/stores/global'

const props = defineProps({
  /** Nível de risco: 'critico' | 'alto' | 'medio' | 'baixo' | 'regular' | 'undefined' ou null (neutro) */
  risk: {
    type: String,
    default: null
  },
  /** Logo de marca/título: usa cores fixas por tema (laranja borda FA5D19, dentro por tema) */
  brand: {
    type: Boolean,
    default: false
  }
})

const globalStore = useGlobalStore()

// Logo de marca (título): tema claro borda FA5D19 dentro F7B58A, tema escuro borda FA5D19 dentro 342827
const BRAND_COLORS = {
  light: { borda: '#FA5D19', dentro: '#F7B58A' },
  dark: { borda: '#FA5D19', dentro: '#342827' }
}

// Cores default
const LOGO_COLORS = {
  critico: { borda: '#e11d48', dentro: '#e11d4833' },
  alto: { borda: '#f97316', dentro: '#f9731633' },
  medio: { borda: '#f59e0b', dentro: '#f59e0b33' },
  regular: { borda: '#10b981', dentro: '#10b98133' },
  baixo: { borda: '#06b6d4', dentro: '#06b6d433' },
  undefined: { borda: '#9ca3af', dentro: '#9ca3af33' }
}

const colors = computed(() => {
  if (props.brand) {
    return BRAND_COLORS[globalStore.isDark ? 'dark' : 'light']
  }
  const palette = LOGO_COLORS
  const key = props.risk && palette[props.risk] ? props.risk : 'undefined'
  return palette[key]
})
</script>
