<template>
  <div>
    <div class="text-center mb-10">
      <h2 class="text-3xl font-bold text-gray-900 dark:text-foreground mb-2">
        Esqueceu sua senha e continue
      </h2>
      <p class="text-gray-500 dark:text-muted-foreground">
        Digite seu email para receber o código de verificação
      </p>
    </div>

    <form @submit.prevent="handleSubmit" novalidate class="space-y-5">
      <Input
        :modelValue="email"
        @update:modelValue="handleEmailUpdate"
        type="email"
        label="Seu email"
        placeholder="Digite seu email"
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
        Enviar agora
      </Button>
    </form>

    <div class="text-center mt-6">
      <p class="text-gray-500 dark:text-muted-foreground text-sm">
        <span
          @click="$emit('back')"
          class="text-gray-900 dark:text-foreground font-semibold hover:text-orange-600 underline transition-colors cursor-pointer"
        >
          ← Voltar para login
        </span>
      </p>
    </div>
  </div>
</template>

<script setup>
import Input from "@/components/Input.vue";
import Button from "@/components/Button.vue";

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

const emit = defineEmits(["submit", "update:email", "back", "clear-error"]);

const handleEmailUpdate = (value) => {
  emit("update:email", value);
  emit("clear-error");
};

const handleSubmit = () => {
  emit("submit");
};
</script>

