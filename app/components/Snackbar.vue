<template>
  <v-snackbar
    v-model="show"
    :color="type"
    :timeout="1500"
    position="fixed"
    location="end top"
  >
    <template #text>
      {{ text }}
    </template>
  </v-snackbar>
</template>

<script setup lang="ts">
const snackbarStore = useSnackbarStore()
const { text, type, show } = storeToRefs(snackbarStore)
</script>
