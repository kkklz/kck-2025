export type SnackbarType = 'info' | 'success' | 'error'

interface SnackbarPayload {
  message: string
  snackbarType?: SnackbarType
}

export const useSnackbarStore = defineStore('snackbar', () => {
  const text = ref('')
  const type = ref<SnackbarType>('info')
  const show = ref(false)

  function showSnackbar({ message, snackbarType = 'info' }: SnackbarPayload) {
    text.value = message
    type.value = snackbarType
    show.value = true
  }

  return {
    text,
    type,
    show,
    showSnackbar,
  }
})
