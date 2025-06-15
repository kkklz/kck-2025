<template>
  <div
    class="memory-card"
    :class="{'flipped': card.isFlipped}"
    @click="$emit('flip')"
  >
    <div class="card-inner">
      <div class="card-front bg-white">
        <v-icon
          size="48"
          icon="mdi-help"
          color="secondary"
        />
      </div>

      <div class="card-back bg-white">
        <v-icon
          size="48"
          :color="card.isMatched
            ? 'green'
            : 'primary'"
        >
          {{ card.icon }}
        </v-icon>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Card {
  icon: string
  isFlipped: boolean
  isMatched: boolean
}

defineProps<{
  card: Card
}>()

defineEmits<{
  flip: []
}>()
</script>

<style scoped>
.memory-card {
  width: 100px;
  height: 100px;
  margin: 5px;
  position: relative;
  perspective: 1000px;
}

.card-inner {
  position: relative;
  width: 100%;
  height: 100%;
  text-align: center;
  transition: transform 0.6s;
  transform-style: preserve-3d;
  cursor: pointer;
}

.memory-card.flipped .card-inner {
  transform: rotateY(180deg);
}

.card-front,
.card-back {
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.card-back {
  transform: rotateY(180deg);
}
</style>
