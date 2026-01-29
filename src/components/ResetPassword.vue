<template>
  <div>
    <div class="text-center mb-10">
      <h2 class="text-3xl font-bold text-gray-900 dark:text-foreground mb-2">
        {{ t('resetPassword.title') }}
      </h2>
      <p class="text-gray-500 dark:text-muted-foreground">
        {{ t('resetPassword.subtitle') }}
      </p>
    </div>

    <form @submit.prevent="handleSubmit" novalidate class="space-y-5">
      <Input
        :modelValue="newPassword"
        @update:modelValue="handleNewPasswordUpdate"
        :label="t('resetPassword.newPasswordLabel')"
        :placeholder="t('resetPassword.newPasswordLabel')"
        :disabled="loading"
        :error="errors.newPassword"
        secret
      />

      <Input
        :modelValue="authStore.resetPasswordConfirmPassword"
        @update:modelValue="handleConfirmPasswordUpdate"
        :label="t('resetPassword.confirmPassword')"
        :placeholder="t('resetPassword.confirmPassword')"
        :disabled="loading"
        :error="errors.confirmPassword"
        secret
      />

      <Button
        type="submit"
        :loading="loading"
        :disabled="loading"
        variant="primary"
        class="mt-8"
      >
        {{ t('resetPassword.continue') }}
      </Button>
    </form>

    <div class="text-center mt-6">
      <Button @click="handleCancel" variant="secondary" class="w-full">
        {{ t('resetPassword.cancel') }}
      </Button>
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
  newPassword: {
    type: String,
    default: "",
  },
  loading: {
    type: Boolean,
    default: false,
  },
  errors: {
    type: Object,
    default: () => ({
      newPassword: "",
      confirmPassword: "",
    }),
  },
});

const authStore = useAuthStore();


const handleNewPasswordUpdate = (value) => {
  authStore.setForgotPasswordNewPassword(value);
  authStore.triggerResetPasswordClearError("newPassword");
};

const handleConfirmPasswordUpdate = (value) => {
  authStore.setResetPasswordConfirmPassword(value);
  authStore.triggerResetPasswordClearError("confirmPassword");
};

const handleSubmit = () => {
  authStore.triggerResetPasswordSubmit();
};

const handleCancel = () => {
  authStore.triggerResetPasswordCancel();
};
</script>

