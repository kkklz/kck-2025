<template>
  <div
    class="pa-4 gap-4 grid"
  >
    <v-card class="py-2">
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
      <AdminNewCourseForm />
    </v-card>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'admin',
})
</script>
