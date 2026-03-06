import { reactive } from 'vue'

export function useFormState(fields: string[]) {
  const touched = reactive<Record<string, boolean>>(
    Object.fromEntries(fields.map((f) => [f, false])),
  )

  function handleBlur(field: string) {
    touched[field] = true
  }

  function touchAll() {
    for (const key of Object.keys(touched)) {
      touched[key] = true
    }
  }

  function resetTouched() {
    for (const key of Object.keys(touched)) {
      touched[key] = false
    }
  }

  return { touched, handleBlur, touchAll, resetTouched }
}
