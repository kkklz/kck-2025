<!-- eslint-disable vue/no-bare-strings-in-template -->
<template>
  <div>
    <div
      class="flex h-[110vh] relative"
    >
      <div class="mt-42 pa-12 lg:w-[40%]">
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
          v-if="coursesRef"
          size="large"
          color="primary"
          @click="coursesRef.scrollIntoView({'behavior': 'smooth'})"
        >
          {{ $t('courses.scroll-to-courses') }}
        </v-btn>
      </div>

      <div class="h-[85%] w-[60%] relative !hidden !lg:block">
        <div class="bg-gradient-overlay inset-0 absolute z-10" />

        <v-img
          src="/hero-image.jpg"
          height="100%"
          cover
          class="relative"
        />
      </div>
    </div>

    <div class="mx-5">
      <v-alert v-if="error">
        {{ error.message }}
      </v-alert>

      <v-breadcrumbs
        :items="breadcrumbs"
      />

      <div
        ref="coursesRef"
        class="mx-4 flex-wrap gap-8 grid min-h-[85vh] xl:flex"
      >
        <div class="flex-[1]">
          <v-card
            :title="$t('courses.filter')"
            color="secondary"
          >
            <v-list>
              <v-list-item>
                <v-text-field
                  v-model="searchByName"
                  append-inner-icon="mdi-magnify"
                  density="compact"
                  label="Wyszukaj kurs (po nazwie)"
                  hide-details
                  class="my-4"
                  variant="outlined"
                />

                <v-text-field
                  v-model="searchByDescription"
                  append-inner-icon="mdi-magnify"
                  density="compact"
                  label="Wyszukaj kurs (po opisie)"
                  hide-details
                  class="my-4"
                  variant="outlined"
                />
              </v-list-item>

              <v-divider />

              <v-list-item>
                <v-radio-group
                  v-model="sortByName"
                  label="Sortowanie (po nazwie)"
                  hide-details
                >
                  <v-radio
                    label="Rosnąco"
                    value="asc"
                  />

                  <v-radio
                    label="Malejąco"
                    value="desc"
                  />
                </v-radio-group>
              </v-list-item>

              <v-divider />

              <v-list-item>
                <v-checkbox
                  v-model="hideCoursesWithoutRewards"
                  label="Ukryj kursy bez nagród"
                  hide-details
                />

                <v-checkbox
                  v-model="hideEmptyCourses"
                  label="Ukryj puste kursy"
                  hide-details
                />
              </v-list-item>
            </v-list>
          </v-card>
        </div>

        <div class="flex-[3]">
          <v-card
            class="mb-4"
            :title="$t('courses.courses-list')"
            color="primary"
          />

          <HomepageCoursesSkeleton v-if="loading" />

          <div class="gap-6 grid grid-cols-1 md:grid-cols-3 sm:grid-cols-2 xl:grid-cols-4">
            <v-card
              v-for="course in filteredCourses"
              :key="course.id"
              link
              :to="`/course/${course.id}`"
              class="pb-4 flex flex-col"
            >
              <v-img
                :src="course.photoUrl || '/default-course-image.webp'"
                height="200"
                cover
              />

              <v-card-title class="text-lg text-black p-4">
                {{ course.name }}
              </v-card-title>

              <v-card-subtitle>
                {{ course.description }}
              </v-card-subtitle>
            </v-card>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="tsx">
definePageMeta({
  alias: ['/', '/courses'],
})

const { t } = useI18n()

const breadcrumbs = [{ title: t('courses.courses-view'), to: '/' }]

const courseStore = useCourseStore()
const { courses, loading, error } = storeToRefs(courseStore)

const searchByName = ref('')
const searchByDescription = ref('')
const sortByName = ref('asc')
const hideEmptyCourses = ref(false)
const hideCoursesWithoutRewards = ref(false)

const coursesRef = ref<HTMLElement | null>(null)

const filteredCourses = computed(() => {
  return courses.value
    .filter((course) => {
      const matchesName = course.name.toLowerCase().includes(searchByName.value.toLowerCase())
      const matchesDescription = course.description.toLowerCase().includes(searchByDescription.value.toLowerCase())

      return matchesName && matchesDescription
    })
    .filter((course) => {
      if (hideEmptyCourses.value) {
        return course.quizzes.length > 0
      }

      return true
    })
    .filter((course) => {
      if (hideCoursesWithoutRewards.value) {
        return course.prizes.length > 0
      }

      return true
    })
    .sort((a, b) => {
      if (sortByName.value === 'asc') {
        return a.name.localeCompare(b.name)
      }
      else {
        return b.name.localeCompare(a.name)
      }
    })
})

onBeforeMount(async () => {
  await courseStore.fetchCourses('all')
})
</script>

<style scoped>
.bg-gradient-overlay {
  background: linear-gradient(
    90deg,
    rgba(var(--v-theme-background), 1) 0%,
    rgba(var(--v-theme-primary), 0.7) 100%
  );
}
</style>
