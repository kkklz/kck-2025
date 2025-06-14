<template>
  <div
    v-if="quizAttempt"
  >
    <v-card
      elevation="2"
      class="mx-auto pa-6 !max-w-[600px]"
    >
      <v-card-title>{{ $t('bonus.gj-u-hv-bonus') }}</v-card-title>

      <v-card-text v-if="quizAttempt.currentBonus">
        {{ $t('bonus.obtained-bonus') }}: {{ bonusesMap[quizAttempt.currentBonus] }}
      </v-card-text>

      <v-btn
        block
        variant="tonal"
        color="primary"
        @click="handleStartBonus"
      >
        {{ $t('universal.okay') }}
      </v-btn>
    </v-card>

    <!--
      <v-overlay
      v-model="showMinigame"
      persistent
      >
      <v-container>
      asdasd
      </v-container>
      </v-overlay>
    -->
  </div>
</template>

<script setup lang="ts">
import type { QuizAttempt } from '~/types/quizAttempt'

const { quizAttempt } = defineProps<{
  quizAttempt: QuizAttempt | null
}>()

const quizAttemptStore = useQuizAttemptStore()
const quizStore = useQuizStore()

const { currentQuiz } = storeToRefs(quizStore)

// const showMinigame = ref(false)

const { t } = useI18n()

const bonusesMap: Record<string, string> = {
  'minigame_shooter': t('bonus.shooter'),
  'minigame_memory': t('bonus.memory'),
  '50_50': t('bonus.50_50'),
  'bonus_time': t('bonus.bonus_time'),
}

async function handleStartBonus() {
  if (!currentQuiz.value)
    return

  switch (quizAttempt?.currentBonus) {
    case 'bonus_time': {
      await quizAttemptStore.addTimeToQuizAttempt(Math.ceil(currentQuiz.value?.timeLimit / currentQuiz.value.questions.length))
      await quizAttemptStore.endBonus(0)
      break
    }
    case '50_50': {
      quizAttemptStore.updateCurrentStage('quiz')
    }
  }
}

// Pozostały czas / (Czas trwania quizu / ilość pytań) * średnia pkt. za pytanie

// function handleEndMinigame(points: number) {

// }
</script>
