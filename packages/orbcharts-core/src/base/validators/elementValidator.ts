import type { ValidatorResult } from '../../../lib/core-types'
import { validator } from '../../utils/validator'
import { isDom } from '../../utils/commonUtils'

export function elementValidator (element: HTMLElement | Element): ValidatorResult {
  const result = validator({ element }, {
    element: {
      toBe: 'Dom',
      test: (value: any) => isDom(value)
    },
  })
  
  return result
}