<template>
  <div>
    <div class="text-center mb-10">
      <h2 class="text-3xl font-bold text-gray-900 dark:text-foreground mb-2">
        Redefina sua senha para acessar
      </h2>
      <p class="text-gray-500 dark:text-muted-foreground">
        Digite sua nova senha e confirme
      </p>
    </div>

    <form @submit.prevent="handleSubmit" novalidate class="space-y-5">
      <Input
        :modelValue="newPassword"
        @update:modelValue="handleNewPasswordUpdate"
        label="Digite sua nova senha"
        placeholder="Digite sua nova senha"
        :disabled="loading"
        :error="errors.newPassword"
        secret
      />

      <Input
        :modelValue="confirmPassword"
        @update:modelValue="handleConfirmPasswordUpdate"
        label="Confirme sua senha"
        placeholder="Confirme sua senha"
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
        Continuar
      </Button>
    </form>

    <div class="text-center mt-6">
      <Button @click="$emit('cancel')" variant="secondary" class="w-full">
        Cancelar
      </Button>
    </div>
  </div>
</template>

<script setup>
import Input from "@/components/Input.vue";
import Button from "@/components/Button.vue";

const props = defineProps({
  newPassword: {
    type: String,
    default: "",
  },
  confirmPassword: {
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

const emit = defineEmits([
  "submit",
  "update:newPassword",
  "update:confirmPassword",
  "cancel",
  "clear-error",
]);

const handleNewPasswordUpdate = (value) => {
  emit("update:newPassword", value);
  emit("clear-error", "newPassword");
};

const handleConfirmPasswordUpdate = (value) => {
  emit("update:confirmPassword", value);
  emit("clear-error", "confirmPassword");
};

const handleSubmit = () => {
  emit("submit");
};
</script>

