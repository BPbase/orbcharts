import type { DataFormatterValidator, DataFormatterTypeMap } from '../../lib/core-types'
import { validateColumns } from '../utils/validator'

export const dataFormatterValidator: DataFormatterValidator<'relationship'> = (dataFormatter: DataFormatterTypeMap<'relationship'>) => {
  const result = validateColumns(dataFormatter, {
    visibleFilter: {
      toBeTypes: ['Function']
    },
    categoryLabels: {
      toBeTypes: ['string[]']
    }
  })
  return result
}