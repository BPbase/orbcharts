import type { DataFormatterValidator, DataFormatterTypeMap } from '../../lib/core-types'

export const dataFormatterValidator: DataFormatterValidator<'series'> = (dataFormatter: DataFormatterTypeMap<'series'>) => {
  
  return {
    status: 'success',
    message: ''
  }
}