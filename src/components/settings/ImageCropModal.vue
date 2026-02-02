<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="modelValue"
        class="fixed inset-0 z-[60] flex items-center justify-center p-4"
      >
        <div
          class="absolute inset-0 bg-black/60 backdrop-blur-sm"
          @click="$emit('update:modelValue', false)"
        />
        <div
          class="relative bg-white dark:bg-card rounded-2xl shadow-xl max-w-sm w-full overflow-hidden"
          @click.stop
        >
          <div class="p-4 border-b border-gray-200 dark:border-border">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-foreground">
              {{ t('settings.cropImage') }}
            </h3>
          </div>

          <div class="p-4 flex justify-center">
            <div
              ref="cropContainerRef"
              class="relative w-44 h-44 sm:w-52 sm:h-52 rounded-full overflow-hidden bg-gray-100 dark:bg-secondary flex-shrink-0 cursor-move select-none border-2 border-gray-200 dark:border-border touch-none"
              @mousedown.prevent="startDrag"
              @touchstart="startDragTouch"
            >
              <img
                ref="cropImageRef"
                :src="imageSrc"
                :style="imageStyle"
                class="absolute pointer-events-none max-w-none select-none"
                draggable="false"
                @load="onImageLoad"
              />
            </div>
          </div>

          <div class="p-4 flex gap-3 justify-end border-t border-gray-200 dark:border-border">
            <button
              type="button"
              @click="$emit('update:modelValue', false)"
              class="px-4 py-2 text-sm text-gray-700 dark:text-muted-foreground hover:bg-gray-100 dark:hover:bg-secondary rounded-lg transition-colors"
            >
              {{ t('settings.cropCancel') }}
            </button>
            <button
              type="button"
              @click="confirmCrop"
              class="px-4 py-2 text-sm font-medium text-white bg-orange-500 hover:bg-orange-600 rounded-lg transition-colors"
            >
              {{ t('settings.cropConfirm') }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useI18n } from '@/composables/useI18n'

const { t } = useI18n()

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  imageSrc: { type: String, default: '' }
})

const CROP_SIZE = 208 // 52 * 4 (w-52 = 13rem = 208px)
const cropContainerRef = ref(null)
const cropImageRef = ref(null)

const offset = ref({ x: 0, y: 0 })
const dragStart = ref(null)
const imageSize = ref({ w: 0, h: 0 })
const containerSize = ref({ w: CROP_SIZE, h: CROP_SIZE })

function clampOffset() {
  const { w: iw, h: ih } = imageSize.value
  const { w: cw, h: ch } = containerSize.value
  if (iw === 0 || ih === 0) return
  const maxX = Math.max(0, iw - cw)
  const maxY = Math.max(0, ih - ch)
  offset.value.x = Math.round(Math.max(-maxX, Math.min(0, offset.value.x)))
  offset.value.y = Math.round(Math.max(-maxY, Math.min(0, offset.value.y)))
}

const imageStyle = computed(() => ({
  left: `${offset.value.x}px`,
  top: `${offset.value.y}px`,
  width: imageSize.value.w ? `${imageSize.value.w}px` : 'auto',
  height: imageSize.value.h ? `${imageSize.value.h}px` : 'auto'
}))

function onImageLoad() {
  const img = cropImageRef.value
  if (!img) return
  const container = cropContainerRef.value
  if (container) {
    containerSize.value = { w: container.offsetWidth, h: container.offsetHeight }
  }
  const iw = img.naturalWidth
  const ih = img.naturalHeight
  const cw = containerSize.value.w
  const ch = containerSize.value.h
  const scale = Math.max(cw / iw, ch / ih)
  imageSize.value = { w: iw * scale, h: ih * scale }
  offset.value = {
    x: Math.round((cw - imageSize.value.w) / 2),
    y: Math.round((ch - imageSize.value.h) / 2)
  }
  clampOffset()
}

function startDrag(e) {
  if (!cropImageRef.value) return
  e.preventDefault()
  dragStart.value = { x: e.clientX - offset.value.x, y: e.clientY - offset.value.y }
  window.addEventListener('mousemove', onDrag)
  window.addEventListener('mouseup', stopDrag)
}

function startDragTouch(e) {
  if (!cropImageRef.value || !e.touches[0]) return
  e.preventDefault()
  const t = e.touches[0]
  dragStart.value = { x: t.clientX - offset.value.x, y: t.clientY - offset.value.y }
  window.addEventListener('touchmove', onDragTouch, { passive: false })
  window.addEventListener('touchend', stopDragTouch)
}

function onDrag(e) {
  if (dragStart.value == null) return
  offset.value = {
    x: e.clientX - dragStart.value.x,
    y: e.clientY - dragStart.value.y
  }
  clampOffset()
}

function onDragTouch(e) {
  if (dragStart.value == null || !e.touches[0]) return
  e.preventDefault()
  const t = e.touches[0]
  offset.value = {
    x: t.clientX - dragStart.value.x,
    y: t.clientY - dragStart.value.y
  }
  clampOffset()
}

function stopDrag() {
  dragStart.value = null
  window.removeEventListener('mousemove', onDrag)
  window.removeEventListener('mouseup', stopDrag)
}

function stopDragTouch() {
  dragStart.value = null
  window.removeEventListener('touchmove', onDragTouch)
  window.removeEventListener('touchend', stopDragTouch)
}

function confirmCrop() {
  const img = cropImageRef.value
  if (!img || !img.complete) return
  const cw = containerSize.value.w
  const ch = containerSize.value.h
  const d = Math.min(CROP_SIZE, cw, ch)
  const scaleX = img.naturalWidth / imageSize.value.w
  const scaleY = img.naturalHeight / imageSize.value.h
  const sx = -offset.value.x * scaleX
  const sy = -offset.value.y * scaleY
  const sW = cw * scaleX
  const sH = ch * scaleY
  const canvas = document.createElement('canvas')
  canvas.width = d
  canvas.height = d
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  ctx.save()
  ctx.beginPath()
  ctx.arc(d / 2, d / 2, d / 2, 0, Math.PI * 2)
  ctx.closePath()
  ctx.clip()
  ctx.drawImage(img, sx, sy, sW, sH, 0, 0, d, d)
  ctx.restore()
  const dataUrl = canvas.toDataURL('image/jpeg', 0.88)
  const base64 = dataUrl.replace(/^data:image\/\w+;base64,/, '')
  const withPrefix = `data:image/jpeg;base64,${base64}`
  emit('crop-complete', withPrefix)
  emit('update:modelValue', false)
}

const emit = defineEmits(['update:modelValue', 'crop-complete'])

watch(() => props.modelValue, (open) => {
  if (open && props.imageSrc) {
    offset.value = { x: 0, y: 0 }
    imageSize.value = { w: 0, h: 0 }
  }
})

watch(() => props.imageSrc, () => {
  if (props.modelValue && cropImageRef.value) {
    onImageLoad()
  }
})
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s ease;
}
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
.modal-enter-from > div:last-child,
.modal-leave-to > div:last-child {
  transform: scale(0.95);
  transition: transform 0.2s ease;
}
</style>
