import type { DataFormatterValidator, DataFormatterTypeMap } from '../../lib/core-types'

export const dataFormatterValidator: DataFormatterValidator<'grid'> = (dataFormatter: DataFormatterTypeMap<'grid'>) => {

  return {
    status: 'success',
    message: ''
  }
}