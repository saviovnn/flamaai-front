<template>
  <div>
    <button @click="navigateTo('/')" class="bg-blue-500 text-white p-2 rounded-md">Home</button>
    <h1>Dashboard FlamaAI</h1>
    <p>{{ authStore.isAuthenticated }}</p>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

authStore.isAuthenticated = true
function navigateTo(path) {
  router.push(path)
}
</script>