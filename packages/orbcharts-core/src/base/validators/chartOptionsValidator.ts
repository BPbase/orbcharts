import type { ChartOptionsPartial, ChartType, ValidatorResult } from '../../../lib/core-types'
import { validateColumns } from '../../utils/validator'

export function chartOptionsValidator<T extends ChartType> (chartOptionsPartial: ChartOptionsPartial<T>): ValidatorResult {
  if (!chartOptionsPartial) {
    // chartOptions 可為空值
    return { status: 'success', columnName: '', expectToBe: '' }
  }
  const result = validateColumns(chartOptionsPartial, {
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