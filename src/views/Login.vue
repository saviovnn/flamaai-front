<template>
  <div class="min-h-screen flex">
    <div class="flex-1 overflow-hidden flex">
      
      <div class="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div 
          class="absolute inset-0 bg-cover bg-center bg-no-repeat" 
          :style="{ backgroundImage: `url(${abstractBg})` }">
        </div>
        
        <div class="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-black/60"></div>
        
          <div class="absolute inset-0 flex flex-col justify-center px-16 z-10">
            <h1 class="text-4xl font-bold text-white leading-tight mb-4">
              Antecipe queimadas<br />
              e tome decisões melhores<br />
              com o poder do FlamaAI.
            </h1>
          </div>
      </div>

      <div class="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-16 bg-gray-50 dark:bg-background">
        <div class="w-full max-w-md">
          
          <div class="flex justify-center mb-8">
            <img :src="logo" alt="FlamaAI" class="w-16 h-16" />
          </div>

          <div class="text-center mb-10">
            <div class="h-20 flex flex-col justify-center">
              <Transition name="slide-fade" mode="out-in">
                <div :key="isSignUp">
                  <h2 class="text-3xl font-bold text-gray-900 dark:text-foreground mb-2">
                    {{ isSignUp ? 'Começar' : 'Bem-vindo de volta' }}
                  </h2>
                  <p class="text-gray-500 dark:text-muted-foreground">
                    {{ isSignUp 
                      ? 'Bem-vindo ao FlamaAI, vamos prever as queimadas' 
                      : 'Entre para continuar na sua conta' 
                    }}
                  </p>
                </div>
              </Transition>
            </div>
          </div>

          <form @submit.prevent="handleSubmit" class="space-y-5">
            <Input
              v-model="formData.email"
              @update:modelValue="clearError('email')"
              type="email"
              label="Seu email"
              placeholder="seu@email.com"
              :disabled="loading"
              :error="errors.email"
            />

            <Transition name="slide-fade" mode="out-in">
              <Input
                v-if="isSignUp"
                key="name-field"
                v-model="formData.name"
                @update:modelValue="clearError('name')"
                type="text"
                label="Seu nome"
                placeholder="João Silva"
                :disabled="loading"
                :error="errors.name"
              />
            </Transition>

            <div>
              <Input
                v-model="formData.password"
                @update:modelValue="clearError('password')"
                :label="isSignUp ? 'Crie uma senha' : 'Sua senha'"
                placeholder="••••••••••"
                :disabled="loading"
                :error="errors.password"
                secret
              />
            </div>

            <Button
              type="submit"
              :loading="loading"
              :disabled="loading"
              variant="primary"
              class="mt-8"
            >
              {{ isSignUp ? 'Criar conta' : 'Entrar' }}
            </Button>
          </form>

          <Divider />

          <GovBrButton
            @click="handleGovBrLogin"
            :disabled="loading"
          />

          <div class="text-center mt-6 ">
            <p class="text-gray-500 dark:text-muted-foreground text-sm">
              {{ isSignUp ? 'Já tem uma conta?' : 'Não tem uma conta?' }}
              <span
                @click="toggleMode"
                class="text-gray-900 dark:text-foreground font-semibold hover:text-orange-600 underline ml-1 transition-colors cursor-pointer"
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
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import { authService } from '@/api/services'
import { useNotification } from '@/composables/useNotification'
import abstractBg from '@/assets/abstract.jpg'
import logoLight from '@/assets/logo.svg'
import logoDark from '@/assets/logo-dark.svg'
import { useGlobalStore } from '@/stores/global'
import Input from '@/components/Input.vue'
import Button from '@/components/Button.vue'
import GovBrButton from '@/components/GovBrButton.vue'
import Divider from '@/components/Divider.vue'

const router = useRouter()
const { notifySuccess } = useNotification()
const globalStore = useGlobalStore()

const logo = computed(() => globalStore.isDark ? logoDark : logoLight)

const isSignUp = ref(false)
const loading = ref(false)

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
  errors.email = ''
  errors.name = ''
  errors.password = ''
}

const handleSubmit = async () => {
  errors.email = ''
  errors.name = ''
  errors.password = ''
  
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

const handleGovBrLogin = async () => {
  errors.email = ''
  errors.name = ''
  errors.password = ''
  
  loading.value = true

  try {
    await authService.loginWithGovBr()
    notifySuccess('Redirecionando para o Gov.br...', 'Autenticação')
  } catch (error) {
    console.error('Erro ao fazer login com Gov.br:', error)
    errors.email = 'Erro ao conectar com Gov.br. Tente novamente.'
    loading.value = false
  }
}
</script>

<style scoped>
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: opacity 0.5s ease;
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  opacity: 0;
}
</style>