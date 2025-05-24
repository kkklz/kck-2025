import { en, pl } from 'vuetify/locale'
import EN from './locales/en.json'
import PL from './locales/pl.json'

export default defineI18nConfig(() => {
  const messages = {
    en: {
      $vuetify: {
        ...en,
      },
      ...EN,
    },
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
