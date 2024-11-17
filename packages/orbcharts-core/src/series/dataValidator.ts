import type { DataValidator, DataTypeMap } from '../../lib/core-types'

export const dataValidator: DataValidator<'series'> = (data: DataTypeMap<'series'>) => {

  return {
    status: 'success',
    message: ''
  }
}