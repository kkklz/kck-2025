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

        <v-list-item
          v-if="user?.role === 'admin'"
          link
          to="/admin"
        >
          {{ $t('admin.admin-panel') }}
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
                @click="authStore.logout"
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
const authStore = useAuthStore()
const userStore = useUserStore()
const { authUser } = storeToRefs(authStore)
const { user } = storeToRefs(userStore)

watch(authUser, (newUser) => {
  authUser.value = newUser
})
</script>
