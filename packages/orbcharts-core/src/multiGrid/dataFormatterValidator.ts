import type { DataFormatterValidator, DataFormatterTypeMap, ValidatorResult } from '../../lib/core-types'
import { validateColumns } from '../utils/validator'

export const dataFormatterValidator: DataFormatterValidator<'multiGrid'> = (dataFormatter: DataFormatterTypeMap<'multiGrid'>) => {
  const result = validateColumns(dataFormatter, {
    visibleFilter: {
      toBeTypes: ['Function']
    },
    gridList: {
      toBeTypes: ['object[]']
    },
    container: {
      toBeTypes: ['object']
    },
    separateGrid: {
      toBeTypes: ['boolean']
    }
  })
  if (dataFormatter.gridList) {
    const gridListResultArr = dataFormatter.gridList.map((grid, index) => {
      const gridResult = validateColumns(grid, {
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
      if (gridResult.status === 'error') {
        return gridResult
      } else {
        if (grid.valueAxis) {
          const valueAxisResult = validateColumns(grid.valueAxis, {
            position: {
              toBe: '"top" | "bottom" | "left" | "right"',
              test: (value) => value === 'top' || value === 'bottom' || value === 'left' || value === 'right'
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
        } else if (grid.groupAxis) {
          const groupAxisResult = validateColumns(grid.groupAxis, {
            position: {
              toBe: '"top" | "bottom" | "left" | "right"',
              test: (value) => value === 'top' || value === 'bottom' || value === 'left' || value === 'right'
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
        return <ValidatorResult>{
          status: 'success',
          columnName: '',
          expectToBe: ''
        }
      }
    })
    const gridListResult = gridListResultArr.find((gridResult) => gridResult.status === 'error')
    if (gridListResult) {
      return gridListResult
    }
  }
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