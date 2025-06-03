<template>
  <div class="mb-2 flex gap-2 items-center">
    <v-text-field
      v-model="answer.answer"
      :label="label"
      density="compact"
      hide-details
      class="flex-1"
    />

    <v-checkbox
      v-model="answer.correct"
      :label="$t('quiz.correct')"
      hide-details
      density="compact"
    />

    <v-btn
      icon="mdi-delete"
      color="error"
      variant="text"
      @click="$emit('remove')"
    />
  </div>
</template>

<script setup lang="ts">
import type { Answer } from '~/types/answer'

const { label } = defineProps<{ label?: string }>()
defineEmits<{ (e: 'remove'): void }>()
const answer = defineModel<Omit<Answer, 'id'>>({ required: true })
</script>
