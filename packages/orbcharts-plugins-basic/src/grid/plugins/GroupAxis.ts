import { 
  Subject,
  takeUntil,
  map,
  distinctUntilChanged,
  shareReplay
} from 'rxjs'
import type { DefinePluginConfig } from '../../../lib/core-types'
import {
  defineGridPlugin } from '../../../lib/core'
import { DEFAULT_GROUP_AXIS_PARAMS } from '../defaults'
import { createBaseGroupAxis } from '../../base/BaseGroupAxis'
import { LAYER_INDEX_OF_AXIS } from '../../const'

const pluginName = 'GroupAxis'

const pluginConfig: DefinePluginConfig<typeof pluginName, typeof DEFAULT_GROUP_AXIS_PARAMS> = {
  name: pluginName,
  defaultParams: DEFAULT_GROUP_AXIS_PARAMS,
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
        toBe: 'number | null | "all"',
        test: (value: any) => {
          return value === null || value === 'all' || typeof value === 'number'
        }
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
      tickTextRotate: {
        toBeTypes: ['number']
      },
      tickTextColorType: {
        toBeOption: 'ColorType',
      }
    })
    return result
  }
}

export const GroupAxis = defineGridPlugin(pluginConfig)(({ selection, name, observer, subject }) => {
  
  const destroy$ = new Subject()

  const unsubscribeBaseGroupAxis = createBaseGroupAxis(pluginName, {
    selection,
    computedData$: observer.computedData$,
    fullParams$: observer.fullParams$,
    fullDataFormatter$: observer.fullDataFormatter$,
    fullChartParams$: observer.fullChartParams$,  
    gridAxesTransform$: observer.gridAxesTransform$,
    gridAxesReverseTransform$: observer.gridAxesReverseTransform$,
    gridAxesSize$: observer.gridAxesSize$,
    gridContainerPosition$: observer.gridContainerPosition$,
    isSeriesSeprate$: observer.isSeriesSeprate$,
    textSizePx$: observer.textSizePx$,
  })

  return () => {
    destroy$.next(undefined)
    unsubscribeBaseGroupAxis()
  }
})