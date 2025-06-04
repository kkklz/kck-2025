<template>
  <v-navigation-drawer
    v-model="drawer"
    :rail="rail"
    permanent
    width="300"
    @click="rail = false"
  >
    <v-list>
      <v-list-item
        :title="$t('admin.admin-panel')"
        subtitle="Ustawienia administratora"
        prepend-icon="mdi-wrench"
      >
        <template #append>
          <v-btn
            icon="mdi-chevron-left"
            variant="text"
            @click.stop="rail = !rail"
          />
        </template>
      </v-list-item>
    </v-list>

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

<script setup lang="ts">
const drawer = ref(true)
const rail = ref(false)
</script>
