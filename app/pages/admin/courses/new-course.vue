<template>
  <div
    class="pa-4 gap-4 grid"
  >
    <v-card class="py-2">
      <v-breadcrumbs
        :items="breadcrumbs"
      />

      <v-card-title class="!text-4xl">
        {{ $t('admin.add-new-course') }}
        <v-btn
          class="m-2"
          link
          to="/admin/courses"
        >
          {{ $t('universal.back') }}
        </v-btn>
      </v-card-title>
    </v-card>

    <v-card class="pa-4">
      <AdminCourseForm mode="new" />
    </v-card>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'admin',
})

const { t } = useI18n()

const breadcrumbs = ref([
  {
    title: t('admin.course-management'),
    to: '/admin/courses',
  },
  {
    title: t('admin.add-new-course'),
  },
])
</script>
