<template>
  <v-card
    class="mb-4 py-4"
    elevation="0"
  >
    <div class="mb-2 flex gap-2 items-center">
      <v-text-field
        v-model="question.content"
        :label="$t('quiz.question-content')"
        class="flex-1"
        hide-details
      />

      <v-number-input
        v-model="question.points"
        :label="$t('quiz.points')"
        :min="1"
        :precision="0"
        hide-details
        style="width: 120px;"
      />

      <v-btn
        icon="mdi-delete"
        color="error"
        variant="text"
        @click="$emit('remove')"
      />
    </div>

    <div>
      <div class="font-bold mb-2">
        {{ $t('quiz.answers') }}
      </div>

      <AdminQuizAnswerEditor
        v-for="(_answer, aIdx) in question.answers"
        :key="aIdx"
        v-model="question.answers[aIdx]!"
        :label="`${$t('quiz.answer')} ${aIdx + 1}`"
        @remove="removeAnswer(aIdx)"
      />

      <v-btn
        class="mt-2"
        icon="mdi-plus"
        size="small"
        @click="addAnswer"
      />
    </div>
  </v-card>
</template>

<script setup lang="ts">
import type { Question } from '~/types/question'
import { nanoid } from 'nanoid'

defineEmits<{ (e: 'remove'): void }>()

const question = defineModel<Question>({ required: true })

function addAnswer() {
  question.value.answers.push({ id: nanoid(), answer: '', correct: false })
}
function removeAnswer(idx: number) {
  question.value.answers.splice(idx, 1)
}
</script>
