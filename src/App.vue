<script setup>
import { RouterView } from 'vue-router'
import { Notivue, NotivueSwipe, Notification, NotificationProgress } from 'notivue'
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
