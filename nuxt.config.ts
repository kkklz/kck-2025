// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',
  devtools: { enabled: true },
  ssr: false,

  future: {
    compatibilityVersion: 4,
  },

  modules: [
    'vuetify-nuxt-module',
    '@unocss/nuxt',
    '@nuxtjs/i18n',
    '@pinia/nuxt',
    '@nuxtjs/supabase',
  ],

  vuetify: {
    vuetifyOptions: {
      icons: {
        defaultSet: 'mdi',
      },
    },
  },

  i18n: {
    defaultLocale: 'pl',
    strategy: 'no_prefix',
  },

  supabase: {
    redirect: true,
    redirectOptions: {
      login: '/login',
      callback: '/confirm',
      exclude: ['/register'],
    },
    types: './app/types/database.types.ts',
  },

  typescript: {
    typeCheck: true,
  },
})
