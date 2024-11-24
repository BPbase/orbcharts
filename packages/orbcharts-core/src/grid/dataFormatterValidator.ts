import type { DataFormatterValidator, DataFormatterTypeMap } from '../../lib/core-types'
import { validateColumns } from '../utils/validator'

export const dataFormatterValidator: DataFormatterValidator<'grid'> = (dataFormatter: DataFormatterTypeMap<'grid'>) => {
  const result = validateColumns(dataFormatter, {
    visibleFilter: {
      toBeTypes: ['Function']
    },
    grid: {
      toBeTypes: ['object']
    },
    container: {
      toBeTypes: ['object']
    }
  })
  if (dataFormatter.grid) {
    const visibleFilterResult = validateColumns(dataFormatter.grid, {
      seriesDirection: {
        toBe: '"row" | "column"',
        test: (value) => value === 'row' || value === 'column'
      },
      rowLabels: {
        toBeTypes: ['string[]']
      },
      columnLabels: {
        toBeTypes: ['string[]']
      },
      valueAxis: {
        toBeTypes: ['object']
      },
      groupAxis: {
        toBeTypes: ['object']
      },
      separateSeries: {
        toBeTypes: ['boolean']
      }
    })
    if (visibleFilterResult.status === 'error') {
      return visibleFilterResult
    }
    if (dataFormatter.grid.valueAxis) {
      const valueAxisResult = validateColumns(dataFormatter.grid.valueAxis, {
        position: {
          toBe: '"left" | "right"',
          test: (value) => value === 'left' || value === 'right'
        },
        scaleDomain: {
          toBe: '[number | "min" | "auto", number | "max" | "auto"]',
          test: (value) => Array.isArray(value) && value.length === 2 && (typeof value[0] === 'number' || value[0] === 'min' || value[0] === 'auto') && (typeof value[1] === 'number' || value[1] === 'max' || value[1] === 'auto')
        },
        scaleRange: {
          toBe: '[number, number]',
          test: (value) => Array.isArray(value) && value.length === 2 && typeof value[0] === 'number' && typeof value[1] === 'number'
        },
        label: {
          toBeTypes: ['string']
        }
      })
      if (valueAxisResult.status === 'error') {
        return valueAxisResult
      }
    }
    if (dataFormatter.grid.groupAxis) {
      const groupAxisResult = validateColumns(dataFormatter.grid.groupAxis, {
        position: {
          toBe: '"top" | "bottom"',
          test: (value) => value === 'top' || value === 'bottom'
        },
        scaleDomain: {
          toBe: '[number, number | "max"]',
          test: (value) => Array.isArray(value) && value.length === 2 && typeof value[0] === 'number' && (typeof value[1] === 'number' || value[1] === 'max')
        },
        scalePadding: {
          toBeTypes: ['number']
        },
        label: {
          toBeTypes: ['string']
        }
      })
      if (groupAxisResult.status === 'error') {
        return groupAxisResult
      }
    }
  }
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