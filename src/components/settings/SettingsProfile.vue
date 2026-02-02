<template>
  <div class="space-y-0">
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between py-3 sm:py-4 border-b border-gray-100 dark:border-border gap-1 sm:gap-0">
      <span class="text-xs sm:text-sm text-gray-700 dark:text-muted-foreground">{{ t('settings.profile') }}</span>
      <div class="flex items-center justify-between gap-0.5 sm:gap-1 w-full sm:w-auto">
        <input
          ref="fileInputRef"
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          class="hidden"
          @change="onFileSelect"
        />
        <div class="flex flex-col gap-0.5">
          <button
            type="button"
            @click="fileInputRef?.click()"
            class="text-left text-xs sm:text-sm text-gray-900 dark:text-foreground hover:opacity-80 transition-opacity"
          >
            {{ user.image ? t('settings.changeImage') : t('settings.addImage') }}
          </button>
          <p v-if="imageError" class="text-xs text-red-500">{{ imageError }}</p>
        </div>
        <div
          class="relative w-10 h-10 rounded-full overflow-hidden bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center flex-shrink-0 border border-gray-200 dark:border-border"
          :class="{ 'cursor-pointer': !user.image }"
          @click="!user.image && fileInputRef?.click()"
        >
          <img
            v-if="user.image"
            :src="user.image"
            alt=""
            class="w-full h-full object-cover pointer-events-none"
          />
          <span v-else class="text-xs font-semibold text-white pointer-events-none">{{ userInitials }}</span>
          <button
            v-if="user.image"
            type="button"
            @click.stop="onRemoveImage"
            class="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 hover:opacity-100 focus:opacity-100 transition-opacity z-10"
            :title="t('settings.removeImage')"
          >
            <Trash2 class="w-5 h-5 text-red-500 flex-shrink-0" />
          </button>
        </div>
      </div>
    </div>

    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between py-3 sm:py-4 border-b border-gray-100 dark:border-border gap-1 sm:gap-0">
      <span class="text-xs sm:text-sm text-gray-700 dark:text-muted-foreground">{{ t('settings.name') }}</span>
      <span class="text-xs sm:text-sm text-gray-900 dark:text-foreground break-words">{{ user.name }}</span>
    </div>

    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between py-3 sm:py-4 border-b border-gray-100 dark:border-border gap-1 sm:gap-0">
      <span class="text-xs sm:text-sm text-gray-700 dark:text-muted-foreground">{{ t('settings.email') }}</span>
      <span class="text-xs sm:text-sm text-gray-900 dark:text-foreground break-all">{{ user.email }}</span>
    </div>

    <div class="flex items-center justify-between py-3 sm:py-4">
      <span class="text-xs sm:text-sm text-gray-700 dark:text-muted-foreground">{{ t('settings.logout') }}</span>
      <button
        @click="$emit('logout')"
        class="px-3 sm:px-4 py-1.5 text-xs sm:text-sm text-red-500 border border-red-300 dark:border-red-500/50 rounded-full hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
      >
        {{ t('settings.logout') }}
      </button>
    </div>

    <ImageCropModal
      v-model="showCropModal"
      :image-src="cropImageSrc"
      @crop-complete="onCropComplete"
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { Trash2 } from 'lucide-vue-next'
import { useI18n } from '@/composables/useI18n'
import { useGlobalStore } from '@/stores/global'
import { useAuthStore } from '@/stores/auth'
import { authService } from '@/api/services'
import ImageCropModal from './ImageCropModal.vue'

const { t } = useI18n()
const globalStore = useGlobalStore()
const authStore = useAuthStore()

const MAX_FILE_SIZE = 5 * 1024 * 1024

const props = defineProps({
  user: {
    type: Object,
    required: true,
    default: () => ({ name: '', email: '', image: null })
  }
})

defineEmits(['logout'])

const userInitials = computed(() => {
  const name = props.user?.name || ''
  const parts = name.trim().split(/\s+/)
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
  }
  return name[0]?.toUpperCase() || 'U'
})

const fileInputRef = ref(null)
const showCropModal = ref(false)
const cropImageSrc = ref('')
const imageError = ref('')
let objectUrlToRevoke = null

function onFileSelect(e) {
  imageError.value = ''
  const file = e.target?.files?.[0]
  e.target.value = ''
  if (!file) return
  if (!file.type.startsWith('image/')) {
    imageError.value = t('settings.invalidImageType')
    return
  }
  if (file.size > MAX_FILE_SIZE) {
    imageError.value = t('settings.imageTooBig')
    return
  }
  if (objectUrlToRevoke) {
    URL.revokeObjectURL(objectUrlToRevoke)
    objectUrlToRevoke = null
  }
  cropImageSrc.value = URL.createObjectURL(file)
  objectUrlToRevoke = cropImageSrc.value
  showCropModal.value = true
}

async function onCropComplete(base64DataUrl) {
  if (objectUrlToRevoke) {
    URL.revokeObjectURL(objectUrlToRevoke)
    objectUrlToRevoke = null
  }
  cropImageSrc.value = ''
  try {
    const userId = globalStore.user?.id
    if (!userId) {
      imageError.value = t('settings.imageTooBig')
      return
    }
    const data = await authService.updateProfileImage(base64DataUrl, userId)
    if (data?.user) {
      const userData = {
        id: data.user.id,
        name: data.user.name,
        email: data.user.email,
        image: data.user.image ?? base64DataUrl
      }
      globalStore.setUser(userData)
      authStore.setUser(userData)
    }
  } catch (err) {
    imageError.value = err.response?.data?.error || t('settings.imageTooBig')
  }
}

async function onRemoveImage() {
  const userId = globalStore.user?.id
  if (!userId) return
  try {
    imageError.value = ''
    const data = await authService.clearProfileImage(userId)
    if (data?.user) {
      const userData = {
        id: data.user.id,
        name: data.user.name,
        email: data.user.email,
        image: null
      }
      globalStore.setUser(userData)
      authStore.setUser(userData)
    }
  } catch (err) {
    imageError.value = err.response?.data?.error || t('settings.imageTooBig')
  }
}
</script>
