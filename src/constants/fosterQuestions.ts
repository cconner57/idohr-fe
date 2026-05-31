import type { IFosterPage } from '@/models/foster-form'

import { PAGES_1_TO_5 } from './foster-questions/pages1-5'
import { PAGES_6_TO_10 } from './foster-questions/pages6-10'

export const FOSTER_PAGES: IFosterPage[] = [...PAGES_1_TO_5, ...PAGES_6_TO_10]
