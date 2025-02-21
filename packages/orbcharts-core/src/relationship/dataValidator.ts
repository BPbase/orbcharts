import type { DataValidator, DataTypeMap } from '../../lib/core-types'
import { validateColumns } from '../utils/validator'
import { isPlainObject } from '../utils'

export const dataValidator: DataValidator<'relationship'> = (data: DataTypeMap<'relationship'>) => {
  const result = validateColumns({ data }, {
    data: {
      toBe: 'DataRelationshipObj | DataRelationshipList',
      // 畢免資料量過大檢查不完，不深度檢查
      test: (value) => isPlainObject(value) || Array.isArray(value)
    }
  })
  return result
}