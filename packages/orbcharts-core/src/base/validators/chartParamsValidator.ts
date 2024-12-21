import type { ChartParamsPartial, ChartType, ValidatorResult } from '../../../lib/core-types'
import { validateColumns } from '../../utils/validator'

export function chartParamsValidator (chartType: ChartType, chartParamsPartial: ChartParamsPartial | undefined): ValidatorResult {
  const highlightTargetToBe: {[key in ChartType]: string[]} = {
    series: ['series', 'datum', 'none'],
    grid: ['series', 'group', 'datum', 'none'],
    multiGrid: ['series', 'group', 'datum', 'none'],
    multiValue: ['category', 'datum', 'none'],
    relationship: ['category', 'datum', 'none'],
    tree: ['category', 'datum', 'none'],
    noneData: ['none']
  }
  
  const result = validateColumns(chartParamsPartial, {
    padding: {
      toBeTypes: ['object'],
    },
    highlightTarget: {
      toBe: highlightTargetToBe[chartType].map(d => `"${d}"`).join(' | '),
      test: (value: any) => {
        return highlightTargetToBe[chartType].includes(value)
      }
    },
    highlightDefault: {
      toBeTypes: ['string', 'null']
    },
    colorScheme: {
      toBe: '"dark" | "light"',
      test: (value: any) => value === 'dark' || value === 'light'
    },
    colors: {
      toBeTypes: ['object'],
      test: (value: any) => {
        return value.light && value.dark
      }
    },
    styles: {
      toBeTypes: ['object'],
    },
    transitionDuration: {
      toBeTypes: ['number'],
    },
    transitionEase: {
      toBeTypes: ['string'],
    }
  })

  if (chartParamsPartial && chartParamsPartial.padding) {
    const paddingResult = validateColumns(chartParamsPartial.padding, {
      top: {
        toBeTypes: ['number'],
      },
      right: {
        toBeTypes: ['number'],
      },
      bottom: {
        toBeTypes: ['number'],
      },
      left: {
        toBeTypes: ['number'],
      },
    })
    
    if (paddingResult.status === 'error') {
      return paddingResult
    }
  }

  if (chartParamsPartial && chartParamsPartial.colors) {
    const colorsResult = validateColumns(chartParamsPartial.colors, {
      light: {
        toBeTypes: ['object'],
      },
      dark: {
        toBeTypes: ['object'],
      },
    })
    
    if (colorsResult.status === 'error') {
      return colorsResult
    }

    if (chartParamsPartial.colors.light) {
      const lightResult = validateColumns(chartParamsPartial.colors.light, {
        label: {
          toBeTypes: ['string[]'],
        },
        primary: {
          toBeTypes: ['string'],
        },
        secondary: {
          toBeTypes: ['string'],
        },
        white: {
          toBeTypes: ['string'],
        },
        background: {
          toBeTypes: ['string'],
        },
      })
      
      if (lightResult.status === 'error') {
        return lightResult
      }
    }

    if (chartParamsPartial.colors.dark) {
      const darkResult = validateColumns(chartParamsPartial.colors.dark, {
        label: {
          toBeTypes: ['string[]'],
        },
        primary: {
          toBeTypes: ['string'],
        },
        secondary: {
          toBeTypes: ['string'],
        },
        white: {
          toBeTypes: ['string'],
        },
        background: {
          toBeTypes: ['string'],
        },
      })
      
      if (darkResult.status === 'error') {
        return darkResult
      }
    }
  }
  
  return result
}