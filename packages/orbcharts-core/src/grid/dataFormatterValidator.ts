import type { DataFormatterValidator, DataFormatterTypeMap } from '../../lib/core-types'
import { validateColumns } from '../utils/validator'

export const dataFormatterValidator: DataFormatterValidator<'grid'> = (dataFormatter: DataFormatterTypeMap<'grid'>) => {
  const result = validateColumns(dataFormatter, {
    visibleFilter: {
      toBeTypes: ['Function']
    },
    // grid: {
    //   toBeTypes: ['object']
    // },
    container: {
      toBeTypes: ['object']
    },
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
  // if (dataFormatter.grid) {
    // const visibleFilterResult = validateColumns(dataFormatter, {
    //   seriesDirection: {
    //     toBe: '"row" | "column"',
    //     test: (value) => value === 'row' || value === 'column'
    //   },
    //   rowLabels: {
    //     toBeTypes: ['string[]']
    //   },
    //   columnLabels: {
    //     toBeTypes: ['string[]']
    //   },
    //   valueAxis: {
    //     toBeTypes: ['object']
    //   },
    //   groupAxis: {
    //     toBeTypes: ['object']
    //   },
    //   separateSeries: {
    //     toBeTypes: ['boolean']
    //   }
    // })
    if (result.status === 'error') {
      return result
    }
    if (dataFormatter.valueAxis) {
      const valueAxisResult = validateColumns(dataFormatter.valueAxis, {
        position: {
          toBe: '"bottom" | "left" | "top" | "right"',
          test: (value) => value === 'bottom' || value === 'left' || value === 'top' || value === 'right'
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
    if (dataFormatter.groupAxis) {
      const groupAxisResult = validateColumns(dataFormatter.groupAxis, {
        position: {
          toBe: '"bottom" | "left" | "top" | "right"',
          test: (value) => value === 'bottom' || value === 'left' || value === 'top' || value === 'right'
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
  // }
  if (dataFormatter.container) {
    const containerResult = validateColumns(dataFormatter.container, {
      columnAmount: {
        toBeTypes: ['number']
      },
      rowAmount: {
        toBeTypes: ['number']
      },
      columnGap: {
        toBe: '"auto" | number',
        test: (value: any) => value === 'auto' || typeof value === 'number'
      },
      rowGap: {
        toBe: '"auto" | number',
        test: (value: any) => value === 'auto' || typeof value === 'number'
      },
    })
    if (containerResult.status === 'error') {
      return containerResult
    }
  }
  return result
}