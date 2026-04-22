export type TFosterSpecies = 'cat' | 'dog' | 'both' | ''

export type TFosterInputType = 'text' | 'textarea' | 'select' | 'date' | 'tel' | 'email' | 'number'

export type TFosterSpeciesScope = 'all' | 'cat' | 'dog'

export interface IFosterQuestion {
  id: string
  number: number
  label: string
  type: TFosterInputType
  required?: boolean
  options?: string[]
  placeholder?: string
  speciesScope?: TFosterSpeciesScope
}

export interface IFosterPage {
  id: number
  title: string
  questions: IFosterQuestion[]
}

export interface IFosterFormState {
  speciesPreference: TFosterSpecies
  currentStep: number
  answers: Record<string, string>
  isSubmitted: boolean
  isSubmitting: boolean
  apiError: string | null
}
