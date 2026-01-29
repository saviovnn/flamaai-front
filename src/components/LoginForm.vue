<template>
  <div>
    <div class="text-center mb-10">
      <div class="h-20 flex flex-col justify-center">
        <Transition name="slide-fade" mode="out-in">
          <div :key="isSignUp">
            <h2
              class="text-3xl font-bold text-gray-900 dark:text-foreground mb-2"
            >
              {{ isSignUp ? t('login.getStarted') : t('login.welcomeBack') }}
            </h2>
            <p class="text-gray-500 dark:text-muted-foreground">
              {{
                isSignUp
                  ? t('login.welcomeSubtitle')
                  : t('login.enterToContinue')
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
        :label="t('login.yourEmail')"
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
          :label="t('login.yourName')"
          placeholder="João Silva"
          :disabled="loading"
          :error="errors.name"
        />
      </Transition>

      <div>
        <Input
          :modelValue="formData.password"
          @update:modelValue="(value) => { updatePassword(value); clearError('password'); }"
          :label="isSignUp ? t('login.createPassword') : t('login.yourPassword')"
          placeholder="••••••••••"
          :disabled="loading"
          :error="errors.password"
          secret
        />
        <div class="flex justify-end mt-2">
          <p class="text-xs text-gray-500 dark:text-muted-foreground">
            {{ t('login.forgotPassword') }}
            <span
              @click="$emit('forgot-password')"
              class="text-orange-500 font-semibold hover:text-orange-600 underline ml-1 transition-colors cursor-pointer"
            >
              {{ t('login.recover') }}
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
        {{ isSignUp ? t('login.createAccount') : t('login.enter') }}
      </Button>
    </form>

    <div class="text-center mt-6">
      <p class="text-gray-500 dark:text-muted-foreground text-sm">
        {{ isSignUp ? t('login.alreadyHaveAccount') : t('login.noAccount') }}
        <span
          @click="$emit('toggle-mode')"
          class="text-gray-900 dark:text-foreground font-semibold hover:text-orange-600 underline ml-1 transition-colors cursor-pointer"
        >
          {{ isSignUp ? t('login.signIn') : t('login.signUp') }}
        </span>
      </p>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useAuthStore } from "@/stores/auth";
import { useI18n } from "@/composables/useI18n";
import Input from "@/components/Input.vue";
import Button from "@/components/Button.vue";

const { t } = useI18n()

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

