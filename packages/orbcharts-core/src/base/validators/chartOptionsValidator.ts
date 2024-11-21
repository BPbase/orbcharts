import type { ChartOptionsPartial, ChartType, ValidatorResult } from '../../../lib/core-types'
import { validator } from '../../utils/validator'

export function chartOptionsValidator<T extends ChartType> (chartOptionsPartial: ChartOptionsPartial<T>): ValidatorResult {
  const result = validator(chartOptionsPartial, {
    width: {
      toBe: '"auto" | number',
      test: (value: any) => value === 'auto' || typeof value === 'number'
    },
    height: {
      toBe: '"auto" | number',
      test: (value: any) => value === 'auto' || typeof value === 'number'
    },
    preset: {
      toBeTypes: ['object']
    }
  })
  
  return result
}