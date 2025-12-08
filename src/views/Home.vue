<template>
  <div>
    <button @click="navigateTo('/dashboard')" class="bg-blue-500 text-white p-2 rounded-md">Dashboard</button>
    <h1>Home FlamaAI</h1>
    <p>{{ authStore.isAuthenticated }}</p>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()
function navigateTo(path) {
  router.push(path)
}
</script>