import type { DataValidator, DataTypeMap } from '../../lib/core-types'

export const dataValidator: DataValidator<'multiValue'> = (data: DataTypeMap<'multiValue'>) => {

  return {
    status: 'success',
    message: ''
  }
}