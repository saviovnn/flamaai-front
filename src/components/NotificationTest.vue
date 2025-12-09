<template>
  <div class="fixed bottom-4 left-4 z-50 flex flex-col gap-2 p-4 bg-white rounded-lg shadow-lg border">
    <h3 class="text-sm font-bold mb-2">Testar Notificações</h3>
    <button 
      @click="testSuccess"
      class="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 text-sm"
    >
      Testar Sucesso
    </button>
    <button 
      @click="testError"
      class="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
    >
      Testar Erro
    </button>
    <button 
      @click="testWarning"
      class="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 text-sm"
    >
      Testar Aviso
    </button>
    <button 
      @click="testInfo"
      class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
    >
      Testar Info
    </button>
  </div>
</template>

<script setup>
import { useNotification } from '@/composables/useNotification'

const { notifySuccess, notifyError, notifyWarning, notifyInfo } = useNotification()

const testSuccess = () => {
  notifySuccess('Operação realizada com sucesso!', 'Sucesso')
}

const testError = () => {
  notifyError('Ocorreu um erro durante a operação', 'Erro')
}

const testWarning = () => {
  notifyWarning('Atenção! Verifique as informações', 'Atenção')
}

const testInfo = () => {
  notifyInfo('Esta é uma informação importante', 'Informação')
}
</script>

