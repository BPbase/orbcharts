import type { DataFormatterValidator, DataFormatterTypeMap } from '../../lib/core-types'

export const dataFormatterValidator: DataFormatterValidator<'tree'> = (dataFormatter: DataFormatterTypeMap<'tree'>) => {
  
  return {
    status: 'success',
    message: ''
  }
}