import { push } from 'notivue'

export function useNotification() {
  const notifySuccess = (message, title = 'Sucesso') => {
    push.success({
      title,
      message,
    })
  }

  const notifyError = (message, title = 'Erro') => {
    push.error({
      title,
      message,
    })
  }

  const notifyWarning = (message, title = 'Atenção') => {
    push.warning({
      title,
      message,
    })
  }

  const notifyInfo = (message, title = 'Informação') => {
    push.info({
      title,
      message,
    })
  }

  const notifyPromise = async (promise, messages) => {
    return push.promise(promise, {
      loading: {
        title: messages.loading?.title || 'Carregando...',
        message: messages.loading?.message || 'Aguarde...',
      },
      success: {
        title: messages.success?.title || 'Sucesso',
        message: messages.success?.message || 'Operação concluída!',
      },
      error: {
        title: messages.error?.title || 'Erro',
        message: messages.error?.message || 'Algo deu errado!',
      },
    })
  }

  return {
    notifySuccess,
    notifyError,
    notifyWarning,
    notifyInfo,
    notifyPromise,
  }
}

