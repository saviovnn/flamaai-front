<template>
  <div class="min-h-screen flex">
    <div class="flex-1 overflow-hidden flex">
      <LoginSidebar />

      <div
        class="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-16 bg-gray-50 dark:bg-background"
      >
        <div class="w-full max-w-md">
          <div class="flex justify-center mb-8">
            <img :src="logo" alt="FlamaAI" class="w-16 h-16" />
          </div>

          <!-- Login/Signup Form -->
          <Transition name="slide-fade" mode="out-in">
            <LoginForm
              v-if="!forgotPasswordStep"
              :isSignUp="isSignUp"
              :loading="loading"
              :errors="loginErrors"
              @submit="handleSubmit"
              @toggle-mode="toggleMode"
              @forgot-password="startForgotPassword"
              @clear-error="clearLoginError"
            />

            <!-- Forgot Password - Email Step -->
            <ForgotPasswordEmail
              v-else-if="forgotPasswordStep === 'email'"
              :email="authStore.forgotPassword.email"
              :loading="loading"
              :error="errors.forgotEmail"
              @update:email="handleEmailUpdate"
              @submit="handleForgotPasswordEmail"
              @back="backToLogin"
              @clear-error="clearError('forgotEmail')"
            />

            <!-- Forgot Password - Code Verification Step -->
            <CodeVerification
              v-else-if="forgotPasswordStep === 'code'"
              :code="authStore.forgotPassword.code"
              :loading="loading"
              :error="errors.forgotCode"
              @update:code="handleCodeUpdate"
              @submit="handleVerifyCode"
              @resend="resendCode"
              @clear-error="clearError('forgotCode')"
            />

            <!-- Forgot Password - Reset Password Step -->
            <ResetPassword
              v-else-if="forgotPasswordStep === 'reset'"
              :newPassword="authStore.forgotPassword.newPassword"
              :confirmPassword="confirmPassword"
              :loading="loading"
              :errors="resetErrors"
              @update:newPassword="handleNewPasswordUpdate"
              @update:confirmPassword="handleConfirmPasswordUpdate"
              @submit="handleResetPassword"
              @cancel="backToLogin"
              @clear-error="clearResetError"
            />
          </Transition>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from "vue";
import { useRouter } from "vue-router";
import { authService } from "@/api/services";
import { useNotification } from "@/composables/useNotification";
import logoLight from "@/assets/logo.svg";
import logoDark from "@/assets/logo-dark.svg";
import { useGlobalStore } from "@/stores/global";
import { useAuthStore } from "@/stores/auth";
import LoginForm from "@/components/LoginForm.vue";
import LoginSidebar from "@/components/LoginSidebar.vue";
import ForgotPasswordEmail from "@/components/ForgotPasswordEmail.vue";
import CodeVerification from "@/components/CodeVerification.vue";
import ResetPassword from "@/components/ResetPassword.vue";

const router = useRouter();
const { notifySuccess, notifyError } = useNotification();
const globalStore = useGlobalStore();
const authStore = useAuthStore();

const logo = computed(() => (globalStore.isDark ? logoDark : logoLight));

const isSignUp = ref(false);
const loading = ref(false);
const forgotPasswordStep = ref(null); // null, 'email', 'code', 'reset'
const confirmPassword = ref("");

const loginErrors = reactive({
  email: "",
  name: "",
  password: "",
});

const errors = reactive({
  forgotEmail: "",
  forgotCode: "",
  newPassword: "",
  confirmPassword: "",
});

const resetErrors = computed(() => ({
  newPassword: errors.newPassword,
  confirmPassword: errors.confirmPassword,
}));

const clearLoginError = (field) => {
  loginErrors[field] = "";
};

const clearError = (field) => {
  errors[field] = "";
};

const clearResetError = (field) => {
  if (field) {
    errors[field] = "";
  }
};

const toggleMode = () => {
  isSignUp.value = !isSignUp.value;
  if (isSignUp.value) {
    authStore.resetRegister();
  } else {
    authStore.resetLogin();
  }
  loginErrors.email = "";
  loginErrors.name = "";
  loginErrors.password = "";
};

const startForgotPassword = () => {
  forgotPasswordStep.value = "email";
  authStore.resetForgotPassword();
  errors.forgotEmail = "";
};

const backToLogin = () => {
  forgotPasswordStep.value = null;
  authStore.resetForgotPassword();
  confirmPassword.value = "";
  Object.keys(errors).forEach((key) => {
    errors[key] = "";
  });
};

const handleEmailUpdate = (value) => {
  authStore.setForgotPasswordEmail(value);
};

const handleCodeUpdate = (value) => {
  authStore.setForgotPasswordCode(value);
};

const handleNewPasswordUpdate = (value) => {
  authStore.setForgotPasswordNewPassword(value);
};

const handleConfirmPasswordUpdate = (value) => {
  confirmPassword.value = value;
};

const handleForgotPasswordEmail = async () => {
  errors.forgotEmail = "";

  const email = authStore.forgotPassword.email?.trim() || "";

  if (!email) {
    errors.forgotEmail = "Por favor, insira seu email";
    return;
  }

  // Validação customizada de email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    errors.forgotEmail = `Inclua um "@" no endereço de e-mail. "${email}" está com um "@" faltando.`;
    return;
  }

  loading.value = true;

  try {
    await authService.forgotPassword(authStore.forgotPassword.email);
    notifySuccess(
      "Verifique seu email para o código de verificação",
      "Código enviado!"
    );
    forgotPasswordStep.value = "code";
    authStore.setForgotPasswordCode("");
  } catch (error) {
    console.error("Erro ao enviar código:", error);
    const errorMsg =
      error.response?.data?.error ||
      error.response?.data?.message ||
      "Ocorreu um erro. Tente novamente.";
    errors.forgotEmail = errorMsg;
    notifyError(errorMsg, "Erro");
  } finally {
    loading.value = false;
  }
};

const handleVerifyCode = async () => {
  errors.forgotCode = "";

  const code = authStore.forgotPassword.code;
  if (code.length !== 6) {
    errors.forgotCode = "Por favor, insira o código completo de 6 dígitos";
    return;
  }

  forgotPasswordStep.value = "reset";
};

const resendCode = async () => {
  if (!authStore.forgotPassword.email) {
    notifyError("Email não encontrado. Volte para a etapa anterior.", "Erro");
    return;
  }

  loading.value = true;
  try {
    await authService.forgotPassword(authStore.forgotPassword.email);
    notifySuccess("Verifique seu email novamente", "Código reenviado!");
    authStore.setForgotPasswordCode("");
  } catch (error) {
    console.error("Erro ao reenviar código:", error);
    const errorMsg =
      error.response?.data?.error ||
      error.response?.data?.message ||
      "Ocorreu um erro. Tente novamente.";
    notifyError(errorMsg, "Erro");
  } finally {
    loading.value = false;
  }
};

const handleResetPassword = async () => {
  errors.newPassword = "";
  errors.confirmPassword = "";

  let hasError = false;

  if (
    !authStore.forgotPassword.newPassword ||
    !authStore.forgotPassword.newPassword.trim()
  ) {
    errors.newPassword = "Por favor, insira sua nova senha";
    hasError = true;
  }

  if (!confirmPassword.value || !confirmPassword.value.trim()) {
    errors.confirmPassword = "Por favor, confirme sua senha";
    hasError = true;
  }

  if (hasError) {
    return;
  }

  if (
    authStore.forgotPassword.newPassword !== confirmPassword.value
  ) {
    errors.confirmPassword = "As senhas não coincidem";
    return;
  }

  loading.value = true;

  try {
    await authService.resetPassword(
      authStore.forgotPassword.email,
      authStore.forgotPassword.code,
      authStore.forgotPassword.newPassword
    );

    notifySuccess(
      "Sua senha foi alterada com sucesso",
      "Senha redefinida!"
    );
    backToLogin();
  } catch (error) {
    console.error("Erro ao redefinir senha:", error);
    const errorMsg =
      error.response?.data?.error ||
      error.response?.data?.message ||
      "Ocorreu um erro. Tente novamente.";
    errors.newPassword = errorMsg;
    notifyError(errorMsg, "Erro");
  } finally {
    loading.value = false;
  }
};

const handleSubmit = async () => {
  loginErrors.email = "";
  loginErrors.name = "";
  loginErrors.password = "";

  let hasError = false;

  if (isSignUp.value) {
    const email = authStore.register.email?.trim() || "";
    const name = authStore.register.name?.trim() || "";
    const password = authStore.register.password?.trim() || "";

    if (!email) {
      loginErrors.email = "Por favor, insira seu email";
      hasError = true;
    } else {
      // Validação customizada de email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        loginErrors.email = `Inclua um "@" no endereço de e-mail. "${email}" está com um "@" faltando.`;
        hasError = true;
      }
    }

    if (!name) {
      loginErrors.name = "Por favor, insira seu nome";
      hasError = true;
    }

    if (!password) {
      loginErrors.password = "Por favor, insira sua senha";
      hasError = true;
    }

    if (hasError) {
      return;
    }

    loading.value = true;

    try {
      const registerData = {
        email: authStore.register.email,
        name: authStore.register.name,
        password: authStore.register.password,
      };

      const response = await authService.register(registerData);

      if (response.token) {
        localStorage.setItem("token", response.token);
      }

      notifySuccess("Bem-vindo", "Conta criada com sucesso!");
      router.push("/dashboard");
    } catch (error) {
      console.error("Erro ao fazer registro:", error);

      if (error.response?.status === 401) {
        loginErrors.email = "Email ou senha incorretos";
        loginErrors.password = "Email ou senha incorretos";
      } else if (error.response?.status === 409) {
        loginErrors.email = "Este email já está cadastrado";
      } else {
        const errorMsg =
          error.response?.data?.message || "Ocorreu um erro. Tente novamente.";
        loginErrors.email = errorMsg;
      }
    } finally {
      loading.value = false;
    }
  } else {
    const email = authStore.login.email?.trim() || "";
    const password = authStore.login.password?.trim() || "";

    if (!email) {
      loginErrors.email = "Por favor, insira seu email";
      hasError = true;
    } else {
      // Validação customizada de email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        loginErrors.email = `Inclua um "@" no endereço de e-mail. "${email}" está com um "@" faltando.`;
        hasError = true;
      }
    }

    if (!password) {
      loginErrors.password = "Por favor, insira sua senha";
      hasError = true;
    }

    if (hasError) {
      return;
    }

    loading.value = true;

    try {
      const loginData = {
        email: authStore.login.email,
        password: authStore.login.password,
      };

      const response = await authService.login(loginData);

      if (response.token) {
        localStorage.setItem("token", response.token);
      }

      notifySuccess("Bem-vindo de volta", "Login realizado com sucesso!");
      router.push("/dashboard");
    } catch (error) {
      console.error("Erro ao fazer login:", error);

      if (error.response?.status === 401) {
        loginErrors.email = "Email ou senha incorretos";
        loginErrors.password = "Email ou senha incorretos";
      } else if (error.response?.status === 409) {
        loginErrors.email = "Este email já está cadastrado";
      } else {
        const errorMsg =
          error.response?.data?.message || "Ocorreu um erro. Tente novamente.";
        loginErrors.email = errorMsg;
      }
    } finally {
      loading.value = false;
    }
  }
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
