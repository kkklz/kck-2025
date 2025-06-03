<template>
  <AdminQuizForm
    :title="$t('quiz.edit-quiz')"
    :quiz-id="quizId"
  />
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'admin',
})

const route = useRoute()

const quizId = route.params.quizId as string
</script>
