<template>
  <v-card
    elevation="2"
    class="mx-auto pa-6 !max-w-[600px]"
  >
    <v-card-title>
      {{ $t('quiz.unfinished-attempt') }}
    </v-card-title>

    <v-card-subtitle>
      {{ $t('quiz.do-you-want-to-continue') }}
    </v-card-subtitle>

    <div class="mt-4 flex justify-between">
      <v-btn
        variant="flat"
        @click="emit('no')"
      >
        {{ $t('universal.no') }}
      </v-btn>

      <v-btn
        color="primary"
        @click="emit('yes')"
      >
        {{ $t('universal.yes') }}
      </v-btn>
    </div>
  </v-card>
</template>

<script setup lang="ts">
const emit = defineEmits<{
  yes: []
  no: []
}>()
</script>
