<template>
  <v-navigation-drawer width="300">
    <v-list-item
      :title="$t('admin.admin-panel')"
      subtitle="Ustawienia administratora"
    />

    <v-divider />

    <v-list-item
      link
      :title="$t('admin.main-view')"
      prepend-icon="mdi-home"
      to="/admin"
    />

    <v-list-item
      link
      :title="$t('admin.user-management')"
      prepend-icon="mdi-account-group"
      to="/admin/users"
    />

    <v-list-item
      link
      :title="$t('admin.course-management')"
      prepend-icon="mdi-text-box-multiple"
      to="/admin/courses"
    />
  </v-navigation-drawer>
</template>
