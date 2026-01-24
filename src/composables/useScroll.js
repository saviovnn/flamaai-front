import { ref, onMounted, onUnmounted } from 'vue'

export function useScroll(threshold = 0) {
  const scrolled = ref(false)

  const onScroll = () => {
    scrolled.value = window.scrollY > threshold
  }

  onMounted(() => {
    window.addEventListener('scroll', onScroll)
    // Check on first load
    onScroll()
  })

  onUnmounted(() => {
    window.removeEventListener('scroll', onScroll)
  })

  return scrolled
}
