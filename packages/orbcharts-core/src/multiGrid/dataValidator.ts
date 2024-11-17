import type { DataValidator, DataTypeMap } from '../../lib/core-types'

export const dataValidator: DataValidator<'multiGrid'> = (data: DataTypeMap<'multiGrid'>) => {

  return {
    status: 'success',
    message: ''
  }
}