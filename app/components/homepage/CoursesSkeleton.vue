<template>
  <div class="mt-12 px-5 gap-6 grid grid-cols-1 md:grid-cols-3 sm:grid-cols-2 xl:grid-cols-4">
    <v-skeleton-loader type="card" />

    <v-skeleton-loader type="card" />

    <v-skeleton-loader
      type="card"
      class="!hidden !md:block"
    />

    <v-skeleton-loader
      type="card"
      class="!hidden !xl:block"
    />
  </div>
</template>
