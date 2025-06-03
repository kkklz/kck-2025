import type { QueryError } from '@supabase/supabase-js'
import type { Course } from '~/types/course'
import type { Database } from '~/types/database.types'

export const useCourseStore = defineStore('course', () => {
  const currentCourse: Ref<Course | null> = ref(null)
  const courses: Ref<Course[]> = ref([])
  const error: Ref<QueryError | null> = ref(null)
  const loading: Ref<boolean> = ref(false)

  const userStore = useUserStore()
  const { user } = storeToRefs(userStore)

  const supabase = useSupabaseClient<Database>()
  const COURSE_TABLE = 'course'
  const COURSE_USER_TABLE = 'course_user'
  const PRIZE_TABLE = 'prize'

  async function fetchCourses(mode: 'all' | 'signed', userId?: string) {
    error.value = null
    loading.value = true
    let query
    if (mode === 'all') {
      query = supabase.from(COURSE_TABLE)
        .select(`
          *,
          quiz(*),
          prize(*),
          course_user(
            user(*)
          )
        `)
    }
    if (mode === 'signed' && userId) {
      query = supabase.from(COURSE_TABLE)
        .select(`
          *,
          quiz(*),
          prize(*),
          course_user(
            user(*)
          )
        `)
        .eq('course_user.userId', userId)
        .not('course_user', 'is', null)
    }
    if (!query)
      return

    try {
      // dodac dodatkowo pobieranie zdjec + zaimplementowac ranking (Nie moze byc QuizAttempt[] tylko nowa struktura bo musi liczyc sume pkt)
      const { data, error: courseError } = await query
      if (courseError)
        throw courseError

      const coursesData = data?.map((course) => {
        const quizzes = (course.quiz || []).map(dbQuizToQuizSummary)
        const prizes = (course.prize || []).map(dbPrizeToPrize)
        const users = (course.course_user || []).map(u => dbUserToUser(u.user))

        return dbCourseToCourse(course, quizzes, prizes, users)
      })
      courses.value = coursesData
    }
    catch (err: any) {
      error.value = err
    }
    finally {
      loading.value = false
    }
  }

  async function fetchCourse(id: string) {
    error.value = null
    loading.value = true
    currentCourse.value = null
    let query
    if (!user.value)
      return
    if (user.value.role === 'admin') {
      query = supabase.from(COURSE_TABLE)
        .select(`
          *,
          quiz(*),
          prize(*),
          course_user(
            user(*)
          )
        `)
        .eq('id', id)
        .single()
    }
    if (user.value.role === 'student') {
      query = supabase.from(COURSE_TABLE)
        .select(`
          *,
          quiz(*),
          prize(*),
          course_user(
            user(*)
          )
        `)
        .eq('id', id)
        .eq('course_user.userId', user.value.id)
        .not('course_user', 'is', null)
        .single()
    }
    if (!query)
      return

    try {
      const { data, error: courseError } = await query
      if (courseError)
        throw courseError
      if (!data)
        throw new Error('Course not found')

      const quizzes = (data.quiz || []).map(dbQuizToQuizSummary)
      const prizes = (data.prize || []).map(dbPrizeToPrize)
      const users = (data.course_user || []).map(u => dbUserToUser(u.user))

      currentCourse.value = dbCourseToCourse(data, quizzes, prizes, users)
    }
    catch (err: any) {
      error.value = err
    }
    finally {
      loading.value = false
    }
  }

  // Bez quizzes, bo zawsze tworzymy pusty kurs
  async function addOrEditCourse(course: Partial<Course>, coursePhoto?: File) {
    error.value = null
    loading.value = true

    try {
      const { data, error: courseError } = await supabase.from(COURSE_TABLE)
        .upsert(courseToDbCourse(course))
        .select()
        .single()

      if (courseError)
        throw courseError

      if (!data)
        throw new Error('Course not created')

      const id = data.id

      // Usuniecie wszystkich uzytkownikow przypisanych do kursu
      const { error: deleteUsersError } = await supabase.from(COURSE_USER_TABLE)
        .delete()
        .eq('courseId', id)
      if (deleteUsersError)
        throw deleteUsersError
      // Usuniecie wszystkich nagrod przypisanych do kursu
      const { error: deletePrizesError } = await supabase.from(PRIZE_TABLE)
        .delete()
        .eq('courseId', id)
      if (deletePrizesError)
        throw deletePrizesError

      if (course.users && course.users.length > 0) {
        const dbCourseUsers = course.users.map((u) => {
          return {
            courseId: id,
            userId: u.id,
          }
        })
        const { error: courseUserError } = await supabase.from(COURSE_USER_TABLE)
          .insert(dbCourseUsers)
        if (courseUserError)
          throw courseUserError
      }

      if (course.prizes && course.prizes.length > 0) {
        const dbPrizes = course.prizes.map(prize => prizeToDbPrize(prize, id))

        const { error: prizeError } = await supabase.from(PRIZE_TABLE)
          .insert(dbPrizes)
        if (prizeError)
          throw prizeError
      }

      if (coursePhoto) {
        const { error: photoError } = await supabase.storage.from('media')
          .upload(`courses/${id}`, coursePhoto, {
            upsert: true,
          })
        if (photoError)
          throw photoError

        const { data: photoData } = supabase.storage.from('media').getPublicUrl(`courses/${id}`)

        await supabase.from(COURSE_TABLE)
          .update({ photoUrl: photoData.publicUrl })
          .eq('id', id)
      }
    }

    catch (err: any) {
      error.value = err
    }
    finally {
      loading.value = false
    }
  }

  return {
    currentCourse,
    courses,
    error,
    loading,
    fetchCourses,
    fetchCourse,
    addOrEditCourse,
  }
})
