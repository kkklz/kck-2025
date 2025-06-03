<template>
  <AdminQuizForm
    :title="$t('quiz.edit-quiz')"
    :quiz-id="quizId"
  />
</template>

<script setup lang="tsx">
const route = useRoute()

const quizId = route.params.quizId as string
</script>
