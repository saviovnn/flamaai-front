<template>
  <div>
    <div class="text-center mb-10">
      <h2 class="text-3xl font-bold text-gray-900 dark:text-foreground mb-2">
        {{ t('forgotPassword.title') }}
      </h2>
      <p class="text-gray-500 dark:text-muted-foreground">
        {{ t('forgotPassword.subtitle') }}
      </p>
    </div>

    <form @submit.prevent="handleSubmit" novalidate class="space-y-5">
      <Input
        :modelValue="email"
        @update:modelValue="handleEmailUpdate"
        type="email"
        :label="t('forgotPassword.yourEmail')"
        :placeholder="t('forgotPassword.placeholder')"
        :disabled="loading"
        :error="error"
      />

      <Button
        type="submit"
        :loading="loading"
        :disabled="loading"
        variant="primary"
        class="mt-8"
      >
        {{ t('forgotPassword.sendNow') }}
      </Button>
    </form>

    <div class="text-center mt-6">
      <p class="text-gray-500 dark:text-muted-foreground text-sm">
        <span
          @click="handleBack"
          class="text-gray-900 dark:text-foreground font-semibold hover:text-orange-600 underline transition-colors cursor-pointer"
        >
          {{ t('forgotPassword.backToLogin') }}
        </span>
      </p>
    </div>
  </div>
</template>

<script setup>
import { useAuthStore } from "@/stores/auth";
import { useI18n } from "@/composables/useI18n";
import Input from "@/components/Input.vue";
import Button from "@/components/Button.vue";

const { t } = useI18n()

const props = defineProps({
  email: {
    type: String,
    default: "",
  },
  loading: {
    type: Boolean,
    default: false,
  },
  error: {
    type: String,
    default: "",
  },
});

const authStore = useAuthStore();


const handleEmailUpdate = (value) => {
  authStore.setForgotPasswordEmail(value);
  authStore.triggerForgotPasswordEmailClearError();
};

const handleSubmit = () => {
  authStore.triggerForgotPasswordEmailSubmit();
};

const handleBack = () => {
  authStore.triggerForgotPasswordEmailBack();
};
</script>

