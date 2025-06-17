<template>
  <div class="bg-primary flex min-h-screen w-screen cursor-crosshair items-center">
    <v-card
      v-if="!beginMinigame && !showSummary"
      elevation="2"
      class="mx-auto pa-6 !max-w-[600px]"
    >
      <v-card-title>
        {{ $t('minigame.shooter-title') }}
      </v-card-title>

      <v-divider />

      <v-card-text>{{ $t('minigame.shooter-instructions') }}</v-card-text>

      <v-btn
        color="primary"
        block
        variant="tonal"
        @click="handleBeginMinigame"
      >
        {{ $t('universal.okay') }}
      </v-btn>
    </v-card>

    <div
      v-if="beginMinigame"
      class="h-screen w-screen select-none relative"
    >
      <h1 class="text-6xl font-bold my-8 text-center">
        {{ $t('minigame.shooter-title') }}
      </h1>

      <h2 class="text-2xl font-bold my-8 text-center">
        {{ totalPoints }} {{ $t('courses.points-short') }}
      </h2>

      <div class="text-2xl font-bold right-10 top-2 absolute">
        {{ formatDate(minigameTime) }}
      </div>

      <MinigameShooterBlob
        v-for="target in targets"
        :key="target.id"
        :width="targetWidth"
        :height="targetHeight"
        :x="target.x"
        :y="target.y"
        @shoot="removeTarget(target.id)"
      />
    </div>

    <v-card
      v-if="showSummary"
      elevation="2"
      class="mx-auto pa-6 !max-w-[600px]"
    >
      <v-card-title>
        {{ $t('minigame.shooter-title') }}
      </v-card-title>

      <v-divider />

      <v-card-text>{{ $t('minigame.shooter-gained-points', {"points": totalPoints}) }}</v-card-text>

      <v-btn
        color="primary"
        block
        variant="tonal"
        @click="handleEndMinigame"
      >
        {{ $t('universal.okay') }}
      </v-btn>
    </v-card>
  </div>
</template>

<script setup lang="ts">
import { nanoid } from 'nanoid'

const { width: windowWidth, height: windowHeight } = useWindow()
interface Target {
  id: string
  x: number
  y: number
  points: number
}

const quizAttemptStore = useQuizAttemptStore()

const beginMinigame = ref(false)
const showSummary = ref(false)

const minigameSpentTime = ref(0)
const minigameSpentTimeIntervalID = ref<NodeJS.Timeout>()

const minigameTime = ref(0)
const targetsInterval = ref<NodeJS.Timeout>()
const timeInterval = ref<NodeJS.Timeout>()

const targets = ref<Target[]>([])
const totalPoints = ref(0)

const targetWidth = computed(() => windowWidth.value / 10)
const targetHeight = computed(() => windowHeight.value / 10)

const maxX = computed(() => {
  return windowWidth.value - targetWidth.value
})

const maxY = computed(() => {
  return windowHeight.value - targetHeight.value
})

function addTarget() {
  const x = Math.floor(Math.random() * maxX.value)
  const y = Math.floor(Math.random() * maxY.value)
  const id = nanoid()
  const points = Math.floor(Math.random() * 5) + 1
  const target: Target = {
    id,
    x,
    y,
    points,
  }

  targets.value.push(target)
}

function handleBeginMinigame() {
  beginMinigame.value = true

  timeInterval.value = setInterval(() => {
    minigameTime.value++
    if (minigameTime.value >= 30) {
      if (timeInterval.value && targetsInterval.value) {
        clearInterval(timeInterval.value)
        clearInterval(targetsInterval.value)
      }
      beginMinigame.value = false
      showSummary.value = true
    }
  }, 1000)

  targetsInterval.value = setInterval(() => {
    addTarget()
  }, 800)
}

async function handleEndMinigame() {
  await quizAttemptStore.addTimeToQuizAttempt(minigameSpentTime.value)
  await quizAttemptStore.endBonus(totalPoints.value)
}

function removeTarget(targetId: string) {
  const target = targets.value.find(t => t.id === targetId)
  if (target) {
    totalPoints.value += target.points
    targets.value = targets.value.filter(t => t.id !== targetId)
  }
}

onMounted(() => {
  minigameSpentTimeIntervalID.value = setInterval(() => {
    minigameSpentTime.value++
  }, 1000)
})

onUnmounted(() => {
  if (minigameSpentTimeIntervalID.value) {
    clearInterval(minigameSpentTimeIntervalID.value)
  }
  if (timeInterval.value) {
    clearInterval(timeInterval.value)
  }
  if (targetsInterval.value) {
    clearInterval(targetsInterval.value)
  }
})
</script>
