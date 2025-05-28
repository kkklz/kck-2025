<template>
  <v-card
    max-width="600px"
    class="mx-auto mt-12 pa-4"
  >
    <v-card-title>{{ $t('universal.login') }}</v-card-title>

    <v-card-text>
      <v-form
        validate-on="lazy"
        class="flex flex-col gap-3"
        @submit.prevent="handleLogin"
      >
        <v-alert
          v-if="error"
          type="error"
        >
          {{ $t('auth.invalid-credentials') }}
        </v-alert>

        <v-text-field
          v-model="email"
          label="E-mail"
          placeholder="john.doe@gmail.com"
          :rules="emailRules"
          variant="underlined"
          type="email"
          required
          density="comfortable"
        />

        <v-text-field
          v-model="password"
          :label="$t('auth.password')"
          :rules="passwordRules"
          :type="showPassword
            ? 'text'
            : 'password'"
          variant="underlined"
          required
        >
          <template #append>
            <v-icon
              :icon="showPassword
                ? 'mdi-eye'
                : 'mdi-eye-off'"
              @click="showPassword = !showPassword"
            />
          </template>
        </v-text-field>

        <div class="flex justify-end">
          <v-btn
            size="small"
            variant="plain"
            type="button"
            to="/forgot-password"
          >
            {{ $t('auth.forgot-password') }}
          </v-btn>
        </div>

        <div
          class="flex flex-col gap-3 items-center items-stretch justify-between md:flex-row"
        >
          <v-btn
            size="large"
            variant="text"
            type="button"
            class="w-full md:w-1/2"
            to="/register"
          >
            {{ $t('universal.register') }}
          </v-btn>

          <v-btn
            size="large"
            variant="tonal"
            type="submit"
            class="w-full md:w-1/2"
            :loading="loading"
          >
            {{ $t('universal.login') }}
          </v-btn>
        </div>
      </v-form>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
const email = ref('')
const password = ref('')
const showPassword = ref(false)

const loading = ref(false)
const authStore = useAuthStore()
const { error } = storeToRefs(authStore)

const { emailRules, passwordRules } = useValidationRules()

async function handleLogin() {
  loading.value = true
  await authStore.handleLogin(email.value, password.value)
  loading.value = false
}
</script>
