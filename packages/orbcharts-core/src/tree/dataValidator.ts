import type { DataValidator, DataTypeMap } from '../../lib/core-types'

export const dataValidator: DataValidator<'tree'> = (data: DataTypeMap<'tree'>) => {

  return {
    status: 'success',
    message: ''
  }
}