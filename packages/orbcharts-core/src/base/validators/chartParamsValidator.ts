import type { ChartParamsPartial, ChartType, ValidatorResult } from '../../../lib/core-types'
import { validator } from '../../utils/validator'

export function chartParamsValidator (chartParamsPartial: ChartParamsPartial): ValidatorResult {
  const result = validator(chartParamsPartial, {
    
  })
  
  return result
}