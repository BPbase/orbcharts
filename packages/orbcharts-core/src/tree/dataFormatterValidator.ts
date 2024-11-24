import type { DataFormatterValidator, DataFormatterTypeMap } from '../../lib/core-types'
import { validateColumns } from '../utils/validator'

export const dataFormatterValidator: DataFormatterValidator<'tree'> = (dataFormatter: DataFormatterTypeMap<'tree'>) => {
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