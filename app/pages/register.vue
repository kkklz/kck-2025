<template>
  <v-card
    max-width="600px"
    class="mx-auto mt-12 pa-4"
  >
    <v-card-title>{{ $t('universal.register') }}</v-card-title>

    <v-card-text>
      <v-form
        v-model="isFormValid"
        validate-on="lazy"
        class="flex flex-col gap-3"
        @submit.prevent="handleRegister"
      >
        <v-alert
          v-if="error"
          type="error"
        >
          {{ $t('auth.email-already-in-use') }}
        </v-alert>

        <div class="my--4 flex justify-end">
          <v-checkbox
            v-model="lecturer"
            :label="$t('universal.lecturer')"
            hide-details
          />
        </div>

        <v-text-field
          v-model="firstName"
          :label="$t('auth.first-name')"
          variant="underlined"
          type="text"
          :rules="firstNameRules"
          required
          density="comfortable"
        />

        <v-text-field
          v-model="lastName"
          :label="$t('auth.last-name')"
          variant="underlined"
          type="text"
          :rules="lastNameRules"
          required
          density="comfortable"
        />

        <v-text-field
          v-model="email"
          label="E-mail"
          placeholder="john.doe@gmail.com"
          variant="underlined"
          type="email"
          :rules="emailRules"
          required
        />

        <v-text-field
          v-if="!lecturer"
          v-model="indexNumber"
          :label="$t('auth.index-number')"
          variant="underlined"
          type="text"
          :rules="indexNumberRules"
          required
          density="comfortable"
        />

        <v-text-field
          v-model="password"
          :label="$t('auth.password')"
          :type="showPassword
            ? 'text'
            : 'password'"
          variant="underlined"
          :rules="passwordRules"
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

        <v-text-field
          v-model="confirmPassword"
          :label="$t('auth.confirm-password')"
          :type="showConfirmPassword
            ? 'text'
            : 'password'"
          variant="underlined"
          required
          :rules="confirmPasswordRules"
        >
          <template #append>
            <v-icon
              :icon="showConfirmPassword
                ? 'mdi-eye'
                : 'mdi-eye-off'"
              @click="showConfirmPassword = !showConfirmPassword"
            />
          </template>
        </v-text-field>

        <div class="flex flex-col gap-3 items-center justify-between md:flex-row">
          <v-btn
            size="large"
            variant="text"
            type="button"
            class="w-full md:w-1/2"
            to="/login"
          >
            {{ $t('universal.login') }}
          </v-btn>

          <v-btn
            size="large"
            variant="tonal"
            type="submit"
            class="w-full md:w-1/2"
            :disabled="!isFormValid"
          >
            {{ $t('universal.register') }}
          </v-btn>
        </div>
      </v-form>
    </v-card-text>
  </v-card>
</template>

<script setup lang="tsx">
const { t } = useI18n()

const authStore = useAuthStore()
const { error } = storeToRefs(authStore)

const lecturer = ref(false)
const firstName = ref('')
const lastName = ref('')
const indexNumber = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const isFormValid = ref<boolean | null>(null)

const showPassword = ref(false)
const showConfirmPassword = ref(false)

const { emailRules, passwordRules, firstNameRules, lastNameRules, indexNumberRules } = useValidationRules()

const confirmPasswordRules = [(value: string) => {
  if (value !== password.value) {
    return t('auth.passwords-must-match')
  }

  return true
}]

async function handleRegister() {
  await authStore.handleRegister(email.value, password.value)
}
</script>
