import type { DataValidator, DataTypeMap } from '../../lib/core-types'

export const dataValidator: DataValidator<'relationship'> = (data: DataTypeMap<'relationship'>) => {

  return {
    status: 'success',
    message: ''
  }
}