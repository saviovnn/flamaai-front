<script setup>
import { onMounted } from 'vue'
import { RouterView } from 'vue-router'
import { Notivue, NotivueSwipe, Notification, NotificationProgress } from 'notivue'
import { useGlobalStore } from '@/stores/global'

const globalStore = useGlobalStore()

onMounted(() => {
  globalStore.initTheme()
})
</script>

<template>
  <Notivue v-slot="item">
    <NotivueSwipe :item="item">
      <Notification :item="item">
        <NotificationProgress :item="item" />
      </Notification>
    </NotivueSwipe>
  </Notivue>
  <RouterView />
</template>
