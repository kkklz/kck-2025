<template>
  <v-form
    @submit.prevent="handleSubmit"
  >
    <v-text-field
      v-model="newName"
      :label="$t('courses.course-name')"
      :rules="notEmptyRule"
      prepend-icon="mdi-pen"
      required
    />

    <v-textarea
      v-model="newDescription"
      :label="$t('courses.course-description')"
      :rules="notEmptyRule"
      prepend-icon="mdi-pen"
      required
    />

    <v-file-input
      v-model="newPhoto"
      accept="image/*"
      :label="$t('courses.course-photo')"
      prepend-icon="mdi-camera"
    />

    <v-img
      v-if="newPhotoUrl"
      :src="newPhotoUrl"
      max-height="150"
    />

    <AdminPrizesSelect v-model="newPrizes" />

    <AdminUsersSelect v-model="newUsers" />

    <div class="flex">
      <v-btn
        class="m-2"
        link
        to="/admin/courses"
        variant="plain"
      >
        {{ $t('universal.back') }}
      </v-btn>

      <v-btn
        variant="tonal"
        type="submit"
        class="m-2"
        :loading="loading"
      >
        {{ props.mode === 'new'
          ? $t('admin.add-new-course')
          : $t('admin.save-changes') }}
      </v-btn>

      <v-btn
        v-if="props.mode === 'edit'"
        variant="tonal"
        class="m-2 ml-auto bg-red"
        :loading="loading"
        @click="handleDelete"
      >
        {{ $t('universal.delete') }}
      </v-btn>
    </div>
  </v-form>
</template>

<script setup lang="ts">
import type { Prize } from '~/types/prize'
import type { User } from '~/types/user'

const props = defineProps<{
  mode: 'new' | 'edit'
  id?: string
  name?: string
  description?: string
  users?: User[]
  prizes?: Omit<Prize, 'id'>[]
  photoUrl?: string
}>()

const { notEmptyRule } = useValidationRules()
const courseStore = useCourseStore()
const { loading } = storeToRefs(courseStore)

const newName = ref('')
const newDescription = ref('')
const newUsers = ref<User[]>([])
const newPrizes = ref<Omit<Prize, 'id'>[]>([])
const newPhoto = ref<File | null>(null)
const newPhotoUrl = ref('')

if (props.mode === 'edit') {
  newName.value = props.name || ''
  newDescription.value = props.description || ''
  newUsers.value = props.users || []
  newPrizes.value = props.prizes || []
  newPhotoUrl.value = props.photoUrl || ''
}

watch(newPhoto, (_newPhoto) => {
  newPhotoUrl.value = _newPhoto
    ? URL.createObjectURL(_newPhoto)
    : ''
})

function handleSubmit() {
  if (newName.value.trim() === '' || newDescription.value.trim() === '') {
    return
  }

  const newCourse = {
    name: newName.value,
    description: newDescription.value,
    users: newUsers.value,
    prizes: newPrizes.value.map((prize) => {
      return { ...prize, id: '0' }
    }),
  }

  setTimeout(async () => {
    if (props.mode === 'new') {
      await courseStore.addOrEditCourse(
        newCourse,
        newPhoto.value || undefined,
      )
    }

    if (props.mode === 'edit') {
      await courseStore.addOrEditCourse(
        { ...newCourse, id: props.id },
        newPhoto.value || undefined,
      )
    }

    newName.value = ''
    newDescription.value = ''
    newUsers.value = []
    newPrizes.value = []

    await courseStore.fetchCourses('all')
    await navigateTo('/admin/courses')
  }, 0)
}

function handleDelete() {
  setTimeout(async () => {
    if (!props.id) {
      return
    }
    await courseStore.deleteCourse(props.id)
    await courseStore.fetchCourses('all')
    await navigateTo('/admin/courses')
  }, 0)
}
</script>
