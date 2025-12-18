<template>
  <div>
    <div class="text-center mb-10">
      <h2 class="text-3xl font-bold text-gray-900 dark:text-foreground mb-2">
        Verifique seu email para começar
      </h2>
      <p class="text-gray-500 dark:text-muted-foreground">
        Digite o código de verificação de 6 dígitos
      </p>
    </div>

    <form @submit.prevent="handleSubmit" novalidate class="space-y-5">
      <div>
        <div class="flex gap-2 justify-center">
          <input
            v-for="(digit, index) in codeDigits"
            :key="index"
            :ref="(el) => (inputRefs[index] = el)"
            v-model="codeDigits[index]"
            @input="handleCodeInput(index, $event)"
            @keydown="handleCodeKeydown(index, $event)"
            @paste="handleCodePaste($event)"
            type="text"
            maxlength="1"
            class="w-12 h-14 text-center text-2xl font-semibold bg-white dark:bg-card border-2 rounded-xl text-gray-900 dark:text-foreground focus:outline-none focus:border-orange-500 border-gray-200 dark:border-border"
            :class="{
              'border-red-500': error,
            }"
            :disabled="loading"
          />
        </div>
        <Transition name="error-fade">
          <p v-if="error" class="mt-2 text-sm text-red-600 text-center">
            {{ error }}
          </p>
        </Transition>
      </div>

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
      <p class="text-gray-500 dark:text-muted-foreground text-sm">
        Não recebeu nenhum código?
        <span
          @click="handleResend"
          class="resend-link font-semibold underline ml-1 transition-colors cursor-pointer"
        >
          Reenviar código
        </span>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, nextTick } from "vue";
import { useAuthStore } from "@/stores/auth";
import Button from "@/components/Button.vue";

const props = defineProps({
  code: {
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

const codeDigits = ref(["", "", "", "", "", ""]);
const inputRefs = ref([]);

// Sincroniza o código externo com os dígitos internos
watch(
  () => props.code,
  (newCode) => {
    if (newCode === "") {
      codeDigits.value = ["", "", "", "", "", ""];
    }
  }
);


const handleCodeInput = (index, event) => {
  const value = event.target.value.replace(/[^0-9]/g, "");
  codeDigits.value[index] = value;

  if (value && index < 5) {
    const nextInput = inputRefs.value[index + 1];
    if (nextInput) {
      nextInput.focus();
    }
  }

  // Atualiza o código completo no store
  const fullCode = codeDigits.value.join("");
  authStore.setForgotPasswordCode(fullCode);
  authStore.triggerCodeVerificationClearError();
};

const handleCodeKeydown = (index, event) => {
  if (event.key === "Backspace" && !codeDigits.value[index] && index > 0) {
    const prevInput = inputRefs.value[index - 1];
    if (prevInput) {
      prevInput.focus();
    }
  }
};

const handleCodePaste = async (event) => {
  event.preventDefault();
  event.stopPropagation();
  
  const pastedData = event.clipboardData
    .getData("text")
    .replace(/[^0-9]/g, "")
    .slice(0, 6);

  if (!pastedData) return;

  // Cria um novo array para garantir reatividade
  const newDigits = ["", "", "", "", "", ""];
  for (let i = 0; i < 6; i++) {
    newDigits[i] = pastedData[i] || "";
  }
  
  // Atualiza o array de forma reativa
  codeDigits.value = [...newDigits];

  // Aguarda o DOM ser atualizado antes de focar
  await nextTick();

  // Foca no último input preenchido ou no primeiro vazio
  const lastFilledIndex = Math.min(pastedData.length - 1, 5);
  const nextEmptyIndex = Math.min(pastedData.length, 5);
  const targetInput =
    inputRefs.value[nextEmptyIndex] || inputRefs.value[lastFilledIndex];
  if (targetInput) {
    targetInput.focus();
  }

  const fullCode = codeDigits.value.join("");
  authStore.setForgotPasswordCode(fullCode);
  authStore.triggerCodeVerificationClearError();
};

const handleSubmit = () => {
  authStore.triggerCodeVerificationSubmit();
};

const handleResend = () => {
  authStore.triggerCodeVerificationResend();
};
</script>

<style scoped>
.error-fade-enter-active,
.error-fade-leave-active {
  transition: all 0.2s ease;
}

.error-fade-enter-from,
.error-fade-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}

.resend-link {
  color: #159cfa;
}

.resend-link:hover {
  color: #0d7fc4;
}
</style>

