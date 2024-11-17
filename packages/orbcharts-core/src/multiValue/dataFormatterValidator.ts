import type { DataFormatterValidator, DataFormatterTypeMap } from '../../lib/core-types'

export const dataFormatterValidator: DataFormatterValidator<'multiValue'> = (dataFormatter: DataFormatterTypeMap<'multiValue'>) => {
  
  return {
    status: 'success',
    message: ''
  }
}