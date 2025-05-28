<template>
  <v-app-bar>
    <v-app-bar-title class="pa-0 inline-flex items-center">
      <NuxtLink
        to="/"
      >
        <v-img
          src="/exam-booster-icon.svg"
          class="h-[50px] w-[150px] inline-block"
        />
      </NuxtLink>
    </v-app-bar-title>

    <template #append>
      <v-list class="flex">
        <v-list-item
          v-if="!authUser"
          link
          to="/login"
          variant="plain"
        >
          {{ $t('universal.login') }}
        </v-list-item>

        <v-list-item
          v-if="!authUser"
          link
          variant="plain"
          to="/register"
        >
          {{ $t('universal.register') }}
        </v-list-item>

        <v-list-item>
          <v-select
            v-model="locale"
            hide-details
            prepend-icon="mdi-translate"
            :items="availableLocales"
          >
            <template #item="{'props': itemProps, item}">
              <v-list-item
                v-bind="itemProps"
                :title="item.value"
                @click="setLocale(item.value)"
              />
            </template>
          </v-select>
        </v-list-item>

        <v-list-item
          v-if="authUser"
          :title="authUser.email!"
        >
          <v-menu
            activator="parent"
          >
            <v-list>
              <v-list-item
                link
                append-icon="mdi-cog"
                to="/settings"
              >
                {{ $t('auth.settings') }}
              </v-list-item>

              <v-list-item
                link
                append-icon="mdi-logout"
                base-color="#F44336"
                @click="authStore.handleLogout"
              >
                {{ $t('auth.logout') }}
              </v-list-item>
            </v-list>
          </v-menu>
        </v-list-item>
      </v-list>
    </template>
  </v-app-bar>
</template>

<script setup lang="ts">
const { locale, availableLocales, setLocale } = useI18n()
const savedLanguage = localStorage.getItem('app_language') as 'pl' | 'en'
if (savedLanguage) {
  setLocale(savedLanguage)
}

const authStore = useAuthStore()
const { authUser } = storeToRefs(authStore)

watch(locale, (newLocale) => {
  localStorage.setItem('app_language', newLocale)
})

watch(authUser, (newUser) => {
  authUser.value = newUser
})
</script>
