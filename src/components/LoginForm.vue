<template>
  <div>
    <div class="text-center mb-10">
      <div class="h-20 flex flex-col justify-center">
        <Transition name="slide-fade" mode="out-in">
          <div :key="isSignUp">
            <h2
              class="text-3xl font-bold text-gray-900 dark:text-foreground mb-2"
            >
              {{ isSignUp ? "Começar" : "Bem-vindo de volta" }}
            </h2>
            <p class="text-gray-500 dark:text-muted-foreground">
              {{
                isSignUp
                  ? "Bem-vindo ao FlamaAI, vamos prever as queimadas"
                  : "Entre para continuar na sua conta"
              }}
            </p>
          </div>
        </Transition>
      </div>
    </div>

    <form @submit.prevent="handleSubmit" novalidate class="space-y-5">
      <Input
        :modelValue="formData.email"
        @update:modelValue="(value) => { updateEmail(value); clearError('email'); }"
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
          :modelValue="formData.name"
          @update:modelValue="(value) => { updateName(value); clearError('name'); }"
          type="text"
          label="Seu nome"
          placeholder="João Silva"
          :disabled="loading"
          :error="errors.name"
        />
      </Transition>

      <div>
        <Input
          :modelValue="formData.password"
          @update:modelValue="(value) => { updatePassword(value); clearError('password'); }"
          :label="isSignUp ? 'Crie uma senha' : 'Sua senha'"
          placeholder="••••••••••"
          :disabled="loading"
          :error="errors.password"
          secret
        />
        <div class="flex justify-end mt-2">
          <p class="text-xs text-gray-500 dark:text-muted-foreground">
            Esqueceu sua senha?
            <span
              @click="$emit('forgot-password')"
              class="text-orange-500 font-semibold hover:text-orange-600 underline ml-1 transition-colors cursor-pointer"
            >
              Recuperar
            </span>
          </p>
        </div>
      </div>

      <Button
        type="submit"
        :loading="loading"
        :disabled="loading"
        variant="primary"
        class="mt-8"
      >
        {{ isSignUp ? "Criar conta" : "Entrar" }}
      </Button>
    </form>

    <div class="text-center mt-6">
      <p class="text-gray-500 dark:text-muted-foreground text-sm">
        {{ isSignUp ? "Já tem uma conta?" : "Não tem uma conta?" }}
        <span
          @click="$emit('toggle-mode')"
          class="text-gray-900 dark:text-foreground font-semibold hover:text-orange-600 underline ml-1 transition-colors cursor-pointer"
        >
          {{ isSignUp ? "Entrar" : "Cadastrar" }}
        </span>
      </p>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useAuthStore } from "@/stores/auth";
import Input from "@/components/Input.vue";
import Button from "@/components/Button.vue";

const props = defineProps({
  isSignUp: {
    type: Boolean,
    default: false,
  },
  loading: {
    type: Boolean,
    default: false,
  },
  errors: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(["submit", "toggle-mode", "forgot-password", "clear-error"]);

const authStore = useAuthStore();

const formData = computed(() => {
  if (props.isSignUp) {
    return authStore.register;
  }
  return authStore.login;
});

const updateEmail = (value) => {
  if (props.isSignUp) {
    authStore.setRegisterEmail(value);
  } else {
    authStore.setLoginEmail(value);
  }
};

const updateName = (value) => {
  if (props.isSignUp) {
    authStore.setRegisterName(value);
  }
};

const updatePassword = (value) => {
  if (props.isSignUp) {
    authStore.setRegisterPassword(value);
  } else {
    authStore.setLoginPassword(value);
  }
};

const clearError = (field) => {
  emit("clear-error", field);
};

const handleSubmit = () => {
  emit("submit");
};
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

