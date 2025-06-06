import type { DataValidator, DataTypeMap } from '../../lib/core-types'
import { validateColumns } from '../utils/validator'

export const dataValidator: DataValidator<'series'> = (data: DataTypeMap<'series'>) => {
  const result = validateColumns({ data }, {
    data: {
      toBe: '(DataSeriesDatum | DataSeriesValue)[][] | (DataSeriesDatum | DataSeriesValue)[]',
      // 畢免資料量過大檢查不完，不深度檢查
      test: (value) => Array.isArray(value)
    }
  })
  return result
}