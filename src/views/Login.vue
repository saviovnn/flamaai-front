<template>
  <div class="min-h-screen flex">
    <!-- Container principal -->
    <div class="flex-1 overflow-hidden flex">
      
      <!-- Left Side - Hero Section -->
      <div class="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <!-- Background Image - Full Height -->
        <div 
          class="absolute inset-0 bg-cover bg-center bg-no-repeat" 
          :style="{ backgroundImage: `url(${abstractBg})` }">
        </div>
        
        <!-- Gradient overlay for text readability -->
        <div class="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-black/60"></div>
        
          <div class="absolute inset-0 flex flex-col justify-center px-16 z-10">
            <h1 class="text-4xl font-bold text-white leading-tight mb-4">
              Antecipe queimadas<br />
              e tome decisões melhores<br />
              com o poder do FlamaAI.
            </h1>
          </div>
      </div>

      <!-- Right Side - Form Section -->
      <div class="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-16 bg-gray-50">
        <div class="w-full max-w-md">
          
          <!-- Logo/Icon -->
          <div class="flex justify-center mb-8">
            <div class="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg relative">
              <Flame :size="40" class="text-white" />
              <Sparkle :size="10" class="text-white fill-white absolute top-3 right-3" fill="currentColor" />
            </div>
          </div>

          <!-- Title Section -->
          <div class="text-center mb-10">
            <div class="h-20 flex flex-col justify-center">
              <Transition name="slide-fade" mode="out-in">
                <div :key="isSignUp">
                  <h2 class="text-3xl font-bold text-gray-900 mb-2">
                    {{ isSignUp ? 'Começar' : 'Bem-vindo de volta' }}
                  </h2>
                  <p class="text-gray-500">
                    {{ isSignUp 
                      ? 'Bem-vindo ao FlamaAI, vamos prever as queimadas' 
                      : 'Entre para continuar na sua conta' 
                    }}
                  </p>
                </div>
              </Transition>
            </div>
          </div>

          <!-- Form -->
          <form @submit.prevent="handleSubmit" class="space-y-5">
            <!-- Email Input -->
            <div>
              <div class="h-6 mb-2">
                <label class="block text-gray-700 text-sm font-medium">
                  Seu email
                </label>
              </div>
              <input
                v-model="formData.email"
                @input="clearError('email')"
                type="email"
                placeholder="seu@email.com"
                :disabled="loading"
                :class="[
                  'w-full px-4 py-3.5 bg-white border-2 rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed',
                  errors.email ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-orange-500'
                ]"
              />
              <Transition name="error-fade">
                <p v-if="errors.email" class="mt-2 text-sm text-red-600">
                  {{ errors.email }}
                </p>
              </Transition>
            </div>

            <!-- Name Input (only for signup) -->
            <Transition name="slide-fade" mode="out-in">
              <div v-if="isSignUp" key="name-field">
                <div class="h-6 mb-2">
                  <label class="block text-gray-700 text-sm font-medium">
                    Seu nome
                  </label>
                </div>
                <input
                  v-model="formData.name"
                  @input="clearError('name')"
                  type="text"
                  placeholder="João Silva"
                  :disabled="loading"
                  :class="[
                    'w-full px-4 py-3.5 bg-white border-2 rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed',
                    errors.name ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-orange-500'
                  ]"
                />
                <Transition name="error-fade">
                  <p v-if="errors.name" class="mt-2 text-sm text-red-600">
                    {{ errors.name }}
                  </p>
                </Transition>
              </div>
            </Transition>

            <!-- Password Input (always visible) -->
            <div>
              <div class="h-6 mb-2">
                <Transition name="slide-fade" mode="out-in">
                  <label :key="isSignUp" class="block text-gray-700 text-sm font-medium">
                    {{ isSignUp ? 'Crie uma senha' : 'Sua senha' }}
                  </label>
                </Transition>
              </div>
              <div class="relative">
                <input
                  v-model="formData.password"
                  @input="clearError('password')"
                  :type="showPassword ? 'text' : 'password'"
                  placeholder="••••••••••"
                  :disabled="loading"
                  :class="[
                    'w-full px-4 py-3.5 bg-white border-2 rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed pr-12',
                    errors.password ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-orange-500'
                  ]"
                />
                <button
                  type="button"
                  @click="showPassword = !showPassword"
                  tabindex="-1"
                  class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-orange-500"
                >
                  <Transition name="eye-fade" mode="out-in">
                    <Eye v-if="!showPassword" :size="20" key="eye-closed" class="eye-transition" />
                    <EyeOff v-else :size="20" key="eye-open" class="eye-transition" />
                  </Transition>
                </button>
              </div>
              <Transition name="error-fade">
                <p v-if="errors.password" class="mt-2 text-sm text-red-600">
                  {{ errors.password }}
                </p>
              </Transition>
            </div>

            <!-- Submit Button -->
            <button
              type="submit"
              :disabled="loading"
              class="w-full py-4 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-orange-500/30 mt-8"
            >
              <span v-if="!loading">
                {{ isSignUp ? 'Criar conta' : 'Entrar' }}
              </span>
              <span v-else class="flex items-center justify-center gap-2">
                <svg class="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Carregando...
              </span>
            </button>
          </form>

          <!-- Divider -->
          <div class="relative my-6">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t border-gray-200"></div>
            </div>
            <div class="relative flex justify-center text-sm">
              <span class="px-4 bg-gray-50 text-gray-500">ou</span>
            </div>
          </div>

          <!-- Google Sign In Button -->
          <button
            type="button"
            @click="handleGoogleLogin"
            :disabled="loading"
            class="w-full py-4 bg-white border-2 border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300 font-medium rounded-xl transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed group"
          >
            <svg class="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            <span>Continuar com Google</span>
          </button>

          <!-- Toggle Login/Signup -->
          <div class="text-center mt-6 ">
            <p class="text-gray-500 text-sm">
              {{ isSignUp ? 'Já tem uma conta?' : 'Não tem uma conta?' }}
              <span
                @click="toggleMode"
                class="text-gray-900 font-semibold hover:text-orange-600 underline ml-1 transition-colors cursor-pointer"
              >
                {{ isSignUp ? 'Entrar' : 'Cadastrar' }}
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { authService } from '@/api/services'
import { Eye, EyeOff, Flame, Sparkle } from 'lucide-vue-next'
import { useNotification } from '@/composables/useNotification'
import abstractBg from '@/assets/abstract.jpg'

const router = useRouter()
const { notifySuccess } = useNotification()

const isSignUp = ref(false)
const loading = ref(false)
const showPassword = ref(false)

const formData = reactive({
  email: '',
  name: '',
  password: ''
})

const errors = reactive({
  email: '',
  name: '',
  password: ''
})

const clearError = (field) => {
  errors[field] = ''
}

const toggleMode = () => {
  isSignUp.value = !isSignUp.value
  formData.name = ''
  formData.password = ''
  showPassword.value = false
  errors.email = ''
  errors.name = ''
  errors.password = ''
}

const handleSubmit = async () => {
  // Limpar erros anteriores
  errors.email = ''
  errors.name = ''
  errors.password = ''
  
  // Validação dos campos
  let hasError = false
  
  if (!formData.email || !formData.email.trim()) {
    errors.email = 'Por favor, insira seu email'
    hasError = true
  }
  
  if (isSignUp.value && (!formData.name || !formData.name.trim())) {
    errors.name = 'Por favor, insira seu nome'
    hasError = true
  }
  
  if (!formData.password || !formData.password.trim()) {
    errors.password = 'Por favor, insira sua senha'
    hasError = true
  }
  
  if (hasError) {
    return
  }
  
  loading.value = true

  try {
    if (isSignUp.value) {
      const response = await authService.register({
        email: formData.email,
        name: formData.name,
        password: formData.password
      })
      
      if (response.token) {
        localStorage.setItem('token', response.token)
      }
      
      notifySuccess('Conta criada com sucesso!', 'Bem-vindo')
      router.push('/dashboard')
    } else {
      const response = await authService.login({
        email: formData.email,
        password: formData.password
      })
      
      if (response.token) {
        localStorage.setItem('token', response.token)
      }
      
      notifySuccess('Login realizado com sucesso!', 'Bem-vindo de volta')
      router.push('/dashboard')
    }
  } catch (error) {
    console.error('Erro ao fazer login/registro:', error)
    
    if (error.response?.status === 401) {
      errors.email = 'Email ou senha incorretos'
      errors.password = 'Email ou senha incorretos'
    } else if (error.response?.status === 409) {
      errors.email = 'Este email já está cadastrado'
    } else {
      const errorMsg = error.response?.data?.message || 'Ocorreu um erro. Tente novamente.'
      errors.email = errorMsg
    }
  } finally {
    loading.value = false
  }
}

const handleGoogleLogin = async () => {
  // Limpar erros anteriores
  errors.email = ''
  errors.name = ''
  errors.password = ''
  
  loading.value = true

  try {
    await authService.loginWithGoogle()
    notifySuccess('Redirecionando para o Google...', 'Autenticação')
  } catch (error) {
    console.error('Erro ao fazer login com Google:', error)
    errors.email = 'Erro ao conectar com Google. Tente novamente.'
    loading.value = false
  }
}
</script>

<style scoped>
/* Transições Vue - Slide Fade (login/cadastro) */
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: opacity 0.3s ease;
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  opacity: 0;
}

/* Transição suave para o ícone do olho */
.eye-fade-enter-active,
.eye-fade-leave-active {
  transition: all 0.2s ease;
}

.eye-fade-enter-from {
  opacity: 0;
  transform: scale(0.8);
}

.eye-fade-leave-to {
  opacity: 0;
  transform: scale(0.8);
}

.eye-transition {
  transition: all 0.2s ease;
}

/* Transição para mensagens de erro */
.error-fade-enter-active,
.error-fade-leave-active {
  transition: all 0.2s ease;
}

.error-fade-enter-from {
  opacity: 0;
  transform: translateY(-4px);
}

.error-fade-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}

/* Efeito de clique nos botões */
button:active {
  transform: scale(0.98);
}
</style>