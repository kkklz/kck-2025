import type { Anchor } from 'vuetify'

export type SnackbarType = 'info' | 'success' | 'error'

interface SnackbarPayload {
  snackbarText: string
  snackbarType?: SnackbarType
  snackbarLocation?: Anchor
  snackbarIcon?: string
}

export const useSnackbarStore = defineStore('snackbar', () => {
  const text = ref('')
  const type = ref<SnackbarType>('info')
  const show = ref(false)
  const location = ref<Anchor>('end top')
  const icon = ref('')

  function showSnackbar({ snackbarText, snackbarType = 'info', snackbarLocation = 'end top', snackbarIcon }: SnackbarPayload) {
    text.value = snackbarText
    type.value = snackbarType
    location.value = snackbarLocation
    icon.value = snackbarIcon || ''
    show.value = true
  }

  return {
    text,
    type,
    show,
    location,
    icon,
    showSnackbar,
  }
})
