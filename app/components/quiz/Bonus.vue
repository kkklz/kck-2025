<template>
  <div
    v-if="quizAttempt"
  >
    <div class="flex h-screen w-screen left-0 top-0 justify-center absolute overflow-hidden">
      <ConfettiExplosion :stage-height="1500" />
    </div>

    <v-card
      elevation="2"
      class="bonus-card mx-auto pa-6 !max-w-[600px]"
    >
      <v-card-title class="mb-6 text-center uppercase !text-3xl !font-bold">
        {{ $t('bonus.gj-u-hv-bonus') }}
      </v-card-title>

      <v-card-text
        v-if="quizAttempt.currentBonus"
        class="text-center"
      >
        <v-icon
          :icon="getBonusIcon(quizAttempt.currentBonus)"
          size="64"
          color="primary"
          class="bonus-icon mb-4"
        />

        <div class="text-h6">
          {{ $t('bonus.obtained-bonus') }}:
          <span class="text-primary">
            {{ bonusesMap[quizAttempt.currentBonus] }}
          </span>
        </div>
      </v-card-text>

      <v-btn
        block
        variant="tonal"
        color="primary"
        class="pulse-button mt-8"
        @click="handleStartBonus"
      >
        {{ $t('universal.okay') }}
      </v-btn>
    </v-card>

    <v-overlay
      v-model="showMinigame"
      persistent
    >
      <v-container class="!p-0">
        <MinigameShooter v-if="quizAttempt.currentBonus === 'minigame_shooter'" />

        <MinigameMemory v-if="quizAttempt.currentBonus === 'minigame_memory'" />
      </v-container>
    </v-overlay>
  </div>
</template>

<script setup lang="ts">
import type { QuizAttempt } from '~/types/quizAttempt'
import ConfettiExplosion from 'vue-confetti-explosion'

const { quizAttempt } = defineProps<{
  quizAttempt: QuizAttempt | null
}>()

const quizAttemptStore = useQuizAttemptStore()
const quizStore = useQuizStore()

const { currentQuiz } = storeToRefs(quizStore)

const showMinigame = ref(false)

const { t } = useI18n()

const bonusesMap: Record<string, string> = {
  'minigame_shooter': t('bonus.shooter'),
  'minigame_memory': t('bonus.memory'),
  '50_50': t('bonus.50_50'),
  'bonus_time': t('bonus.bonus_time'),
}

function getBonusIcon(bonusType: string): string {
  return {
    'minigame_shooter': 'mdi-target',
    'minigame_memory': 'mdi-brain',
    '50_50': 'mdi-dice-multiple',
    'bonus_time': 'mdi-clock-plus',
  }[bonusType] || 'mdi-gift'
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
      break
    }
    case 'minigame_shooter': {
      showMinigame.value = true
      break
    }

    case 'minigame_memory': {
      showMinigame.value = true
      break
    }
  }
}
</script>

<style scoped>
.bonus-card {
  animation: slideUp 0.5s ease-out;
  background: linear-gradient(145deg, var(--v-theme-surface) 0%, var(--v-theme-background) 100%);
  border: 1px solid rgba(var(--v-theme-primary), 0.1);
}

.bonus-icon {
  animation: bounceIn 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

.pulse-button {
  animation: pulse 2s infinite;
}

@keyframes slideUp {
  from {
    transform: translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

@keyframes bounceIn {
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1.2);
  }
  100% {
    transform: scale(1);
  }
}

@keyframes pulse {
  0% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(var(--v-theme-primary), 0.4);
  }
  70% {
    transform: scale(1.05);
    box-shadow: 0 0 0 10px rgba(var(--v-theme-primary), 0);
  }
  100% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(var(--v-theme-primary), 0);
  }
}
</style>
