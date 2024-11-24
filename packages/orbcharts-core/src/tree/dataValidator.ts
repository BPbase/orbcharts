import type { DataValidator, DataTypeMap } from '../../lib/core-types'
import { validateColumns } from '../utils/validator'
import { isPlainObject } from '../utils'

export const dataValidator: DataValidator<'tree'> = (data: DataTypeMap<'tree'>) => {
  const result = validateColumns({ data }, {
    data: {
      toBe: 'DataTreeObj | DataTreeDatum[]',
      // 畢免資料量過大檢查不完，不深度檢查
      test: (value) => isPlainObject(value) && value.id !== undefined
    }
  })
  return result
}