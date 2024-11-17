import type { DataValidator, DataTypeMap } from '../../lib/core-types'

export const dataValidator: DataValidator<'grid'> = (data: DataTypeMap<'grid'>) => {

  return {
    status: 'success',
    message: ''
  }
}