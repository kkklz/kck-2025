<template>
  <v-form
    @submit.prevent="addNewCourse"
  >
    <v-text-field
      v-model="newName"
      :label="$t('courses.course-name')"
      :rules="notEmptyRule"
      required
    />

    <v-textarea
      v-model="newDescription"
      :label="$t('courses.course-description')"
      :rules="notEmptyRule"
      required
    />

    <AdminPrizesSelect v-model="newPrizes" />

    <AdminUsersSelect v-model="newUsers" />

    <v-btn
      variant="tonal"
      type="submit"
      class="mt-4"
      :loading="loading"
    >
      {{ $t('admin.add-new-course') }}
    </v-btn>
  </v-form>
</template>

<script setup lang="ts">
import type { Prize } from '~/types/prize'
import type { User } from '~/types/user'

const { notEmptyRule } = useValidationRules()
const courseStore = useCourseStore()
const { loading } = storeToRefs(courseStore)

const newName = ref('')
const newDescription = ref('')
const newUsers = ref<User[]>([])
const newPrizes = ref<Omit<Prize, 'id'>[]>([])

function addNewCourse() {
  if (newName.value.trim() === '' || newDescription.value.trim() === '') {
    return
  }
  courseStore.addCourse({
    name: newName.value,
    description: newDescription.value,
    users: newUsers.value,
    prizes: newPrizes.value.map((prize) => {
      return { ...prize, id: '0' }
    }),
  })
  newName.value = ''
  newDescription.value = ''
  newUsers.value = []
  newPrizes.value = []

  navigateTo('/admin/courses')
}
</script>
