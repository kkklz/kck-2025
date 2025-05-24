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
    'nuxt-vuefire',
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

  vuefire: {
    auth: {
      enabled: true,
    },
    config: {
      apiKey: import.meta.env.NUXT_PUBLIC_API_KEY,
      authDomain: import.meta.env.NUXT_PUBLIC_AUTH_DOMAIN,
      projectId: import.meta.env.NUXT_PUBLIC_PROJECT_ID,
      appId: import.meta.env.NUXT_PUBLIC_APP_ID,
    },
  },

  typescript: {
    typeCheck: true,
  },
})
