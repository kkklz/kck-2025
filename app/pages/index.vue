<!-- eslint-disable vue/no-bare-strings-in-template -->
<template>
  <div
    class="flex min-h-screen w-full items-center left-0 top-0 absolute"
  >
    <div class="pa-12 lg:w-[40%]">
      <h1 class="text-6xl font-bold mb-4">
        Witaj w <span class="text-primary">ExamBooster</span>!
      </h1>

      <h2 class="text-3xl mb-6">
        Jedynej takiej platformie, która zamieni naukę w przygodę
      </h2>

      <p class="text-2xl mb-8">
        Odkryj interaktywne kursy, zdobywaj nagrody i ucz się poprzez grę.
        Twoja droga do sukcesu zaczyna się tutaj!
      </p>

      <v-btn
        v-if="user !== null"
        size="large"
        color="primary"
        to="/courses"
      >
        {{ $t('courses.scroll-to-courses') }}
      </v-btn>

      <div
        v-else
        class="flex justify-between"
      >
        <v-btn
          size="large"
          color="primary"
          to="/login"
        >
          {{ $t('universal.login') }}
        </v-btn>

        <v-btn
          size="large"
          color="secondary"
          to="/register"
          variant="outlined"
        >
          {{ $t('universal.register') }}
        </v-btn>
      </div>
    </div>

    <div class="h-screen w-[60%] relative !hidden !lg:block">
      <div class="bg-gradient-overlay inset-0 absolute z-10" />

      <v-img
        src="/hero-image.jpg"
        height="100%"
        cover
        class="relative"
      />
    </div>
  </div>
</template>

<script setup lang="tsx">
const userStore = useUserStore()
const { user } = storeToRefs(userStore)
</script>

<style scoped>
.bg-gradient-overlay {
  background: linear-gradient(
    90deg,
    rgba(var(--v-theme-background), 1) 0%,
    rgba(var(--v-theme-primary), 0.3) 50%,
    rgba(var(--v-theme-primary), 0.7) 100%
  );
}
</style>
