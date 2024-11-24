import type { DataFormatterValidator, DataFormatterTypeMap } from '../../lib/core-types'

export const dataFormatterValidator: DataFormatterValidator<'relationship'> = (dataFormatter: DataFormatterTypeMap<'relationship'>) => {
  
  return {
    status: 'success',
    columnName: '',
    expectToBe: ''
  }
}