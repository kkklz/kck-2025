export function useValidationRules() {
  const { t } = useI18n()

  const emailRules = [(value: string) => {
    const regex = /^[\w\-.]+@([\w-]+\.)+[\w-]{2,4}$/g
    if (value.match(regex)) {
      return true
    }

    return t('auth.email-must-be-valid')
  }]

  const passwordRules = [(value: string) => {
    const regex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/gm
    if (value.match(regex)) {
      return true
    }

    return t('auth.password-rules')
  }]

  const firstNameRules = [(value: string) => {
    const regex = /^[A-ZĄĆĘŁŃÓŚŹŻ][a-ząćęłńóśźż'-]+$/
    if (value.match(regex)) {
      return true
    }

    return t('auth.invalid-first-name')
  }]

  const lastNameRules = [(value: string) => {
    const regex = /^[A-ZĄĆĘŁŃÓŚŹŻ][a-ząćęłńóśźż'-]+(?: [A-ZĄĆĘŁŃÓŚŹŻ][a-ząćęłńóśźż'-]+)?$/
    if (value.match(regex)) {
      return true
    }

    return t('auth.invalid-last-name')
  }]

  const indexNumberRules = [(value: string) => {
    const regex = /^\d+$/
    if (value.match(regex)) {
      return true
    }

    return t('auth.invalid-index-number')
  }]

  return {
    emailRules,
    passwordRules,
    firstNameRules,
    lastNameRules,
    indexNumberRules,
  }
}
