import type { DataFormatterValidator, DataFormatterTypeMap } from '../../lib/core-types'
import { validateColumns } from '../utils/validator'

export const dataFormatterValidator: DataFormatterValidator<'multiValue'> = (dataFormatter: DataFormatterTypeMap<'multiValue'>) => {
  const result = validateColumns(dataFormatter, {
    visibleFilter: {
      toBeTypes: ['Function']
    },
    container: {
      toBeTypes: ['object']
    },
    categoryLabels: {
      toBeTypes: ['string[]']
    },
    valueLabels: {
      toBeTypes: ['string[]']
    },
    xAxis: {
      toBeTypes: ['object']
    },
    yAxis: {
      toBeTypes: ['object']
    },
    separateCategory: {
      toBeTypes: ['boolean']
    }
  })
  if (result.status === 'error') {
    return result
  }
  if (dataFormatter.yAxis) {
    const valueAxisResult = validateColumns(dataFormatter.yAxis, {
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
      },
      valueIndex: {
        toBeTypes: ['number']
      }
    })
    if (valueAxisResult.status === 'error') {
      return valueAxisResult
    }
  }
  if (dataFormatter.xAxis) {
    const groupAxisResult = validateColumns(dataFormatter.xAxis, {
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
      },
      valueIndex: {
        toBeTypes: ['number']
      }
    })
    if (groupAxisResult.status === 'error') {
      return groupAxisResult
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