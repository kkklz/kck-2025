<template>
  <div class="bg-secondary flex min-h-screen w-screen items-center justify-center">
    <v-card
      v-if="!beginMinigame && !showSummary"
      elevation="2"
      class="mx-auto pa-6 !max-w-[600px]"
    >
      <v-card-title>
        {{ $t('minigame.memory-title') }}
      </v-card-title>

      <v-divider />

      <v-card-text>{{ $t('minigame.memory-instructions') }}</v-card-text>

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
    >
      <h1 class="text-6xl font-bold my-8 text-center">
        {{ $t('minigame.memory-title') }}
      </h1>

      <div class="text-2xl font-bold right-10 top-2 absolute">
        {{ formatDate(minigameTime) }}
      </div>

      <div class="p-4 gap-4 grid grid-cols-5">
        <MinigameMemoryCard
          v-for="(card, index) in memoryCards"
          :key="index"
          :card="card"
          @flip="handleCardFlip(index)"
        />
      </div>
    </div>

    <v-card
      v-if="showSummary"
      elevation="2"
      class="mx-auto pa-6 !max-w-[600px]"
    >
      <v-card-title>
        {{ $t('minigame.memory-title') }}
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

<script setup lang=ts>
interface Card {
  icon: string
  isFlipped: boolean
  isMatched: boolean
}

const ICONS = [
  'mdi-airplane',
  'mdi-alarm',
  'mdi-alien',
  'mdi-ambulance',
  'mdi-apple',
  'mdi-arm-flex',
  'mdi-atv',
  'mdi-axe',
  'mdi-bicycle',
  'mdi-boomerang',
]

const quizAttemptStore = useQuizAttemptStore()

const beginMinigame = ref(false)
const showSummary = ref(false)

const minigameSpentTime = ref(0)
const minigameSpentTimeIntervalID = ref<NodeJS.Timeout>()

const minigameTime = ref(0)
const timeInterval = ref<NodeJS.Timeout>()

const memoryCards = ref<Card[]>([])
const flippedCards = ref<number[]>([])
const matchedPairs = ref(0)

const totalPoints = ref(0)

onMounted(() => {
  minigameSpentTimeIntervalID.value = setInterval(() => {
    minigameSpentTime.value++
  }, 1000)
})

onUnmounted(() => {
  if (minigameSpentTimeIntervalID.value) {
    clearInterval(minigameSpentTimeIntervalID.value)
  }
})

function initializeCards() {
  const icons = [...ICONS, ...ICONS]
  const shuffledIcons = icons.sort(() => Math.random() - 0.5)

  memoryCards.value = shuffledIcons.map(icon => ({
    icon,
    isFlipped: false,
    isMatched: false,
  }))

  matchedPairs.value = 0
  flippedCards.value = []
}

function handleCardFlip(index: number) {
  const card = memoryCards.value[index]
  if (!card)
    return

  if (card.isFlipped || card.isMatched || flippedCards.value.length >= 2)
    return

  card.isFlipped = true
  flippedCards.value.push(index)
  if (flippedCards.value && flippedCards.value.length === 2) {
    const [firstIndex, secondIndex] = flippedCards.value
    if (firstIndex === undefined || secondIndex === undefined)
      return

    const firstCard = memoryCards.value[firstIndex]
    const secondCard = memoryCards.value[secondIndex]
    if (firstCard === undefined || secondCard === undefined)
      return

    if (firstCard.icon === secondCard.icon) {
      firstCard.isMatched = true
      secondCard.isMatched = true
      matchedPairs.value++
      totalPoints.value += 5

      if (matchedPairs.value === ICONS.length) {
        setTimeout(() => initializeCards(), 500)

        return
      }
    }

    setTimeout(() => {
      if (!firstCard.isMatched) {
        firstCard.isFlipped = false
        secondCard.isFlipped = false
      }
      flippedCards.value = []
    }, 500)
  }
}

function handleBeginMinigame() {
  beginMinigame.value = true

  initializeCards()

  timeInterval.value = setInterval(() => {
    minigameTime.value++
    if (minigameTime.value >= 30) {
      if (timeInterval.value) {
        clearInterval(timeInterval.value)
      }
      beginMinigame.value = false
      showSummary.value = true
    }
  }, 1000)
}

async function handleEndMinigame() {
  await quizAttemptStore.addTimeToQuizAttempt(minigameSpentTime.value)
  await quizAttemptStore.endBonus(totalPoints.value)
}
</script>
