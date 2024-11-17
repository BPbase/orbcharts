import type { DataFormatterValidator, DataFormatterTypeMap } from '../../lib/core-types'

export const dataFormatterValidator: DataFormatterValidator<'multiGrid'> = (dataFormatter: DataFormatterTypeMap<'multiGrid'>) => {
  
  return {
    status: 'success',
    message: ''
  }
}