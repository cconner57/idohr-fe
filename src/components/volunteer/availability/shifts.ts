export interface SlotDefinition {
  id: string
  value: string
  label: string
  description: string
  type: 'everyday' | 'adoption' | 'fixed'
  days: string[]
}

export const SHIFTS: SlotDefinition[] = [
  {
    id: '10am_12pm',
    value: '10AM – 12PM',
    label: '10AM – 12PM',
    description: 'Clean, feed, & socialize with cats',
    type: 'everyday',
    days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
  },
  {
    id: '12pm_2pm',
    value: '12PM – 2PM',
    label: '12PM – 2PM',
    description: 'Focus on cat socializing & customer support',
    type: 'everyday',
    days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
  },
  {
    id: '2pm_4pm',
    value: '2PM – 4PM',
    label: '2PM – 4PM',
    description: 'Focus on cat socializing & customer support',
    type: 'everyday',
    days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
  },
  {
    id: '4pm_6pm',
    value: '4PM – 6PM',
    label: '4PM – 6PM',
    description: 'Focus on cat socializing & customer support',
    type: 'everyday',
    days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
  },
  {
    id: '6pm_8pm',
    value: '6PM – 8PM',
    label: '6PM – 8PM (Monday - Saturday)',
    description: 'Clean, feed, & socialize with cats',
    type: 'everyday',
    days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  },
  {
    id: 'sunday_pm',
    value: 'Sunday PM Clean/Feed/Socialize: 4PM - 6PM',
    label: 'Sunday PM: 4PM - 6PM',
    description: 'Sunday PM clean, feed, & socialize with cats (PetSmart closes early)',
    type: 'fixed',
    days: ['Sunday'],
  },
  {
    id: 'event_12pm_2pm',
    value: 'Adoption Event: 12PM - 2PM',
    label: 'Adoption Event: 12PM - 2PM',
    description: 'Focus on cat adoptions & customer support',
    type: 'adoption',
    days: ['Saturday', 'Sunday'],
  },
  {
    id: 'event_2pm_4pm',
    value: 'Adoption Event: 2PM - 4PM',
    label: 'Adoption Event: 2PM - 4PM',
    description: 'Focus on cat adoptions & customer support',
    type: 'adoption',
    days: ['Saturday', 'Sunday'],
  },
  {
    id: 'event_cleanup',
    value: 'Adoption Event Cleanup (Sunday): 4PM - 6PM',
    label: 'Adoption Event Cleanup (Sunday): 4PM - 6PM',
    description: 'Help with Sunday event cleanup, breakdown, and post-event cat care support',
    type: 'fixed',
    days: ['Sunday'],
  },
]
