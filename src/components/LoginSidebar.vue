<template>
  <div class="hidden lg:flex lg:w-1/2 relative overflow-hidden">
    <div
      class="absolute inset-0 bg-cover bg-center bg-no-repeat"
      :style="{ backgroundImage: `url(${abstractBg})` }"
    ></div>

    <div
      class="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-black/60"
    ></div>

    <div class="absolute inset-0 flex flex-col justify-center px-16 z-10">
      <h1 class="text-4xl font-bold text-white leading-tight mb-4">
        {{ t('login.loginSidebarTitle') }}
      </h1>
    </div>
  </div>
</template>

<script setup>
import { useI18n } from "@/composables/useI18n";
import abstractBg from "@/assets/abstract.jpg";

const { t } = useI18n()
</script>

