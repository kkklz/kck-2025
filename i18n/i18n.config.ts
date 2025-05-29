import { pl } from 'vuetify/locale'
import PL from './locales/pl.json'

export default defineI18nConfig(() => {
  const messages = {
    pl: {
      $vuetify: {
        ...pl,
      },
      ...PL,
    },
  }

  return {
    messages,
  }
})
