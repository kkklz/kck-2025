<template>
  <div
    class="pa-4 gap-4 grid"
  >
    <v-card class="py-2">
      <v-breadcrumbs
        :items="breadcrumbs"
      />

      <v-card-title class="!text-4xl">
        {{ title }}
      </v-card-title>

      <v-alert
        v-if="error !== null"
        type="error"
      >
        {{ error.message }}
      </v-alert>

      <v-form
        class="px-6 py-6"
        validate-on="lazy"
        @submit.prevent="handleSubmit"
      >
        <v-textarea
          v-model="description"
          required
          :rules="quizInputRules"
          :label="$t('quiz.description')"
          auto-grow
        />

        <v-number-input
          v-model="timeLimitS"
          :label="$t('quiz.time-limit')"
          :precision="0"
          control-variant="split"
          :min="1"
        />

        <v-number-input
          v-model="maxAttempts"
          :label="$t('quiz.max-attempts')"
          :precision="0"
          control-variant="split"
          :min="1"
        />

        <div class="mb-2 mt-6 flex items-center justify-between">
          <h2 class="text-2xl">
            {{ $t('quiz.questions') }}
          </h2>

          <v-btn
            icon="mdi-plus"
            variant="text"
            @click="addQuestion"
          />
        </div>

        <QuizQuestionEditor
          v-for="(question, qId) in questions"
          :key="qId"
          :model-value="question"
          @update:model-value="updateQuestion(qId, $event)"
          @remove="removeQuestionById(qId)"
        />

        <v-btn
          class="mr-4 mt-4"
          variant="plain"
          :to="`/admin/courses/${courseId}`"
        >
          {{ $t('universal.back') }}
        </v-btn>

        <v-btn
          class="mt-4"
          color="primary"
          type="submit"
          :loading="loading"
        >
          {{ $t('universal.save') }}
        </v-btn>
      </v-form>
    </v-card>
  </div>
</template>

<script setup lang="ts">
import type { Question } from '~/types/question'
import { nanoid } from 'nanoid'
import QuizQuestionEditor from '~/components/admin/QuizQuestionEditor.vue'

const { title, quizId } = defineProps<{ title: string, quizId?: string }>()
const description = ref('')
const timeLimitS = ref(15)
const timeLimit = computed(() => timeLimitS.value * 60)
const maxAttempts = ref(1)
const questions = ref<Question[]>([])
const loading = ref(false)

const quizStore = useQuizStore()
const { error, currentQuiz } = storeToRefs(quizStore)
const route = useRoute()
const courseId = route.params.id as string

const { t } = useI18n()
const { quizInputRules } = useValidationRules()

const breadcrumbs = ref<{ title: string, to?: string }[]>()

onBeforeMount(async () => {
  breadcrumbs.value = [
    {
      title: t('admin.course-management'),
      to: '/admin/courses',
    },
    {
      title: t('admin.course-settings'),
      to: `/admin/courses/${courseId}`,
    },
    {
      title: quizId
        ? t('admin.quiz-settings')
        : t('admin.add-quiz'),
    },
  ]

  if (quizId !== undefined) {
    await quizStore.fetchQuiz(quizId)

    if (currentQuiz.value !== null) {
      description.value = currentQuiz.value.description
      timeLimitS.value = currentQuiz.value.timeLimit / 60
      maxAttempts.value = currentQuiz.value.maxAttempts
      questions.value = currentQuiz.value.questions
    }
  }
})

function addQuestion() {
  questions.value.push({
    id: nanoid(),
    content: '',
    points: 1,
    answers: [
      { id: nanoid(), answer: '', correct: false },
      { id: nanoid(), answer: '', correct: false },
    ],
  })
}

function removeQuestionById(id: number) {
  questions.value.splice(id, 1)
}

function updateQuestion(id: number, newVal: Question) {
  questions.value[id] = newVal
}

async function handleSubmit() {
  loading.value = true
  error.value = null
  if (!description.value.trim())
    return

  if (quizId !== undefined) {
    await quizStore.updateQuiz(quizId, { id: quizId, description: description.value, maxAttempts: maxAttempts.value, questions: questions.value, timeLimit: timeLimit.value })
  }
  else {
    // 1. Stwórz quiz
    const quiz = await quizStore.addQuiz({
      id: nanoid(),
      description: description.value,
      timeLimit: timeLimit.value,
      maxAttempts: maxAttempts.value,
      questions: [],
    }, courseId)
    // 2. Dodaj pytania i odpowiedzi
    await Promise.all(
      questions.value.map(async (q) => {
        const dbQ = await quizStore.addQuestion(q, quiz.id)
        await Promise.all(
          q.answers.map(a => quizStore.addAnswer(a, dbQ.id)),
        )
      }),
    )
  }

  loading.value = false

  if (!error.value) {
    navigateTo(`/admin/courses/${courseId}`)
  }
}
</script>
