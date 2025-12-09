import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router'
import App from './App.vue'
import { createNotivue } from 'notivue'

// Importar estilos do Notivue ANTES do style.css customizado
import 'notivue/notifications.css'
import 'notivue/notifications-progress.css'
import 'notivue/animations.css'
import './style.css'

const app = createApp(App)
const pinia = createPinia()

const notivue = createNotivue({
  position: 'top-right',
  limit: 5,
  enqueue: true,
  avoidDuplicates: true,
  pauseOnHover: true,
  pauseOnTouch: true,
  notifications: {
    global: {
      duration: 5000,
    },
  },
})

app.use(pinia)
app.use(router)
app.use(notivue)
app.mount('#app')
