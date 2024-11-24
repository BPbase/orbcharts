import type { DataFormatterValidator, DataFormatterTypeMap } from '../../lib/core-types'
import { validateColumns } from '../utils/validator'

export const dataFormatterValidator: DataFormatterValidator<'series'> = (dataFormatter: DataFormatterTypeMap<'series'>) => {
  const result = validateColumns(dataFormatter, {
    visibleFilter: {
      toBeTypes: ['Function']
    },
    sort: {
      toBeTypes: ['Function', 'null']
    },
    seriesLabels: {
      toBeTypes: ['string[]']
    },
    container: {
      toBeTypes: ['object']
    },
    separateSeries: {
      toBeTypes: ['boolean']
    },
    sumSeries: {
      toBeTypes: ['boolean']
    }
  })
  if (dataFormatter.container) {
    const containerResult = validateColumns(dataFormatter.container, {
      gap: {
        toBeTypes: ['number']
      },
      rowAmount: {
        toBeTypes: ['number']
      },
      columnAmount: {
        toBeTypes: ['number']
      }
    })
    if (containerResult.status === 'error') {
      return containerResult
    }
  }
  return result
}