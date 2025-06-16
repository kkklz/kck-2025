<template>
  <v-snackbar
    v-model="show"
    :color="type"
    :timeout="2000"
    position="fixed"
    :location="location"
    :prepend-icon="icon"
  >
    <template #text>
      <v-icon
        v-if="icon"
        :icon="icon"
      /> {{ text }}
    </template>
  </v-snackbar>
</template>

<script setup lang="ts">
const snackbarStore = useSnackbarStore()
const { text, type, show, location, icon } = storeToRefs(snackbarStore)
</script>
