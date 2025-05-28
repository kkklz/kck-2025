<!-- eslint-disable vue/no-bare-strings-in-template -->
<!-- eslint-disable vue/padding-line-between-tags -->
<template>
  <v-app-bar>
    <v-app-bar-title>
      <NuxtLink
        to="/"
        class="w-min"
      >
        <v-img
          src="/exam-booster-icon.svg"
          class="h-[50px] w-[150px]"
        />
      </NuxtLink>
    </v-app-bar-title>

    <template #append>
      <v-list class="flex">
        <v-list-item link>
          Login
        </v-list-item>
        <v-list-item link>
          Register
        </v-list-item>
      </v-list>
    </template>
  </v-app-bar>
</template>
