<template>
  <v-card
    :title="$t('prizes.prizes')"
    elevation="0"
    class="px-4"
  >
    <v-list>
      <v-list-item
        v-for="(prize, index) in orderedPrizes"
        :key="index"
        link
        prepend-icon="mdi-trophy"
      >
        <v-list-item-title>
          {{ $t('prizes.place', [
            Array.isArray(prize.place)
              ? `${prize.place[0]} - ${prize.place[1]}`
              : prize.place,
          ]) }}
        </v-list-item-title>

        <v-list-item-subtitle>
          {{ prize.reward }}
        </v-list-item-subtitle>

        <template #append>
          <v-btn
            icon="mdi-close"
            variant="flat"
            @click="prizes = prizes.filter(p => p !== prize)"
          />
        </template>
      </v-list-item>

      <v-form
        validate-on="invalid-input"
        @submit.prevent="addPrize"
      >
        <v-container>
          <v-row>
            <v-col cols="1">
              <v-number-input
                v-model="newFrom"
                :min="1"
                :max="50"
                :label="$t('prizes.place-from')"
                control-variant="hidden"
                required
              />
            </v-col>

            <v-col cols="1">
              <v-number-input
                v-model="newTo"
                :min="1"
                :max="50"
                :label="$t('prizes.place-to')"
                control-variant="hidden"
                required
              />
            </v-col>

            <v-col>
              <v-text-field
                v-model="newReward"
                :label="$t('prizes.prize')"
                required
              />
            </v-col>
          </v-row>

          <v-alert
            v-if="errorMessage"
            type="error"
            density="compact"
            class="mb-2"
          >
            {{ errorMessage }}
          </v-alert>

          <v-btn
            variant="outlined"
            type="submit"
          >
            {{ $t('prizes.add-prize') }}
          </v-btn>
        </v-container>
      </v-form>
    </v-list>
  </v-card>
</template>

<script setup lang="ts">
import type { Prize } from '~/types/prize'

const { t } = useI18n()

const prizes = defineModel<Omit<Prize, 'id'>[]>({ required: true })

const errorMessage = ref('')
const newFrom = ref(1)
const newTo = ref(1)
const newReward = ref('')

function addPrize() {
  if (newReward.value.trim() === '')
    return
  if (newFrom.value > newTo.value) {
    errorMessage.value = t('prizes.invalid-places-message')

    return
  }

  prizes.value.push({
    place: newFrom.value === newTo.value
      ? newFrom.value
      : [newFrom.value, newTo.value],
    reward: newReward.value,
  })
  errorMessage.value = ''
  newFrom.value = 1
  newTo.value = 1
  newReward.value = ''
}

const orderedPrizes = computed(() => {
  return [...prizes.value].sort((a, b) => {
    const aValue = Array.isArray(a.place)
      ? a.place[0]
      : a.place
    const bValue = Array.isArray(b.place)
      ? b.place[0]
      : b.place

    return aValue - bValue
  })
})
</script>
