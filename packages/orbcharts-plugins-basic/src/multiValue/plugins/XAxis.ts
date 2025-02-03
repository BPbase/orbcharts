import {
  Observable,
  Subject,
  combineLatest,
  takeUntil,
  map,
  distinctUntilChanged,
  switchMap,
  shareReplay
} from 'rxjs'
import type {
  DefinePluginConfig,
} from '../../../lib/core-types'
import {
  defineMultiValuePlugin,
} from '../../../lib/core'
import { DEFAULT_X_AXIS_PARAMS } from '../defaults'
import { LAYER_INDEX_OF_AXIS } from '../../const'
import { createBaseXAxis } from '../../base/BaseXAxis'

const pluginName = 'XAxis'


const pluginConfig: DefinePluginConfig<typeof pluginName, typeof DEFAULT_X_AXIS_PARAMS> = {
  name: pluginName,
  defaultParams: DEFAULT_X_AXIS_PARAMS,
  layerIndex: LAYER_INDEX_OF_AXIS,
  validator: (params, { validateColumns }) => {
    const result = validateColumns(params, {
      labelOffset: {
        toBe: '[number, number]',
        test: (value: any) => {
          return Array.isArray(value)
            && value.length === 2
            && typeof value[0] === 'number'
            && typeof value[1] === 'number'
        }
      },
      labelColorType: {
        toBeOption: 'ColorType',
      },
      axisLineVisible: {
        toBeTypes: ['boolean']
      },
      axisLineColorType: {
        toBeOption: 'ColorType',
      },
      ticks: {
        toBeTypes: ['number', 'null']
      },
      tickFormat: {
        toBeTypes: ['string', 'Function']
      },
      tickLineVisible: {
        toBeTypes: ['boolean']
      },
      tickPadding: {
        toBeTypes: ['number']
      },
      tickFullLine: {
        toBeTypes: ['boolean']
      },
      tickFullLineDasharray: {
        toBeTypes: ['string']
      },
      tickColorType: {
        toBeOption: 'ColorType',
      },
      tickTextColorType: {
        toBeOption: 'ColorType',
      }
    })
    if (result.status === 'error') {
      return result
    }
    return result
  }
}



export const XAxis = defineMultiValuePlugin(pluginConfig)(({ selection, name, observer, subject }) => {
  
  const destroy$ = new Subject()

  const unsubscribeBaseXAxis = createBaseXAxis(pluginName, {
    selection,
    computedData$: observer.computedData$,
    fullParams$: observer.fullParams$,
    fullDataFormatter$: observer.fullDataFormatter$,
    fullChartParams$: observer.fullChartParams$,
    isCategorySeprate$: observer.isCategorySeprate$,
    multiValueContainerPosition$: observer.multiValueContainerPosition$,
    layout$: observer.layout$,
    filteredMinMaxXYData$: observer.filteredMinMaxXYData$,
    minMaxXY$: observer.minMaxXY$,
  })

  return () => {
    destroy$.next(undefined)
    unsubscribeBaseXAxis()
  }
})