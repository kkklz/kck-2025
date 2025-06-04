<template>
  <v-alert
    v-if="submitted && !error && !loading"
    type="success"
    class="mb-4"
  >
    {{ $t('universal.saved-successfully') }}
  </v-alert>

  <v-alert
    v-if="error"
    type="error"
    class="mb-4"
  >
    {{ error.message }}
  </v-alert>

  <v-card
    max-width="1200"
    class="mx-auto mt-4 pa-8"
  >
    <v-btn
      variant="plain"
      class="!pa-4"
      @click="useRouter().back()"
    >
      {{ $t('universal.back') }}
    </v-btn>

    <v-card-title class="!text-4xl">
      {{ $t('universal.settings') }}
    </v-card-title>

    <v-card-subtitle v-if="props.user.id !== user?.id">
      ({{ props.user.firstName }} {{ props.user.lastName }})
    </v-card-subtitle>

    <v-card-text>
      <v-form
        class="mt-4 gap-4 grid"
        @submit.prevent="handleSubmit"
      >
        <v-text-field
          v-model="newFirstName"
          :label="$t('auth.first-name')"
          variant="underlined"
          type="text"
          :rules="firstNameRules"
          required
        />

        <v-text-field
          v-model="newLastName"
          :label="$t('auth.last-name')"
          variant="underlined"
          type="text"
          :rules="lastNameRules"
          required
        />

        <v-text-field
          v-model="newIndexNumber"
          :label="$t('auth.index-number')"
          variant="underlined"
          type="text"
          :rules="indexNumberRules"
          required
        />

        <v-select
          v-if="user?.role === 'admin'"
          v-model="newRole"
          :label="$t('universal.role')"
          :items="[
            'student',
            'admin',
          ]"
          variant="underlined"
          type="text"
          required
        />

        <v-file-input
          v-model="newPhoto"
          accept="image/*"
          :label="$t('users.user-photo')"
          prepend-icon="mdi-camera"
        />

        <v-btn
          type="submit"
          variant="tonal"
          :loading="loading"
        >
          {{ $t('universal.save') }}
        </v-btn>
      </v-form>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import type { User } from '~/types/user'

const props = defineProps<{ user: User }>()

const userStore = useUserStore()
const { user, error, loading } = storeToRefs(userStore)

const submitted = ref(false)
const newFirstName = ref('')
const newLastName = ref('')
const newIndexNumber = ref('')
const newRole = ref<'student' | 'admin'>('student')
const newPhoto = ref<File | null>(null)

const { firstNameRules, lastNameRules, indexNumberRules } = useValidationRules()

onMounted(() => {
  submitted.value = false
  if (props.user) {
    newFirstName.value = props.user.firstName
    newLastName.value = props.user.lastName
    newIndexNumber.value = props.user.studentIndex || ''
    newRole.value = props.user.role as 'student' | 'admin'
  }
})

function handleSubmit() {
  submitted.value = false
  setTimeout(async () => {
    await userStore.updateUser(
      props.user.id,
      {
        firstName: newFirstName.value,
        lastName: newLastName.value,
        studentIndex: newIndexNumber.value,
        role: newRole.value,
      },
      newPhoto.value || undefined,
    )
    submitted.value = true
    if (user.value)
      await userStore.fetchUser(user.value.id)
  }, 0)
}
</script>
