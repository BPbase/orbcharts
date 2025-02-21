import {
  Subject,
  Observable,
  takeUntil,
  map,
  distinctUntilChanged,
  shareReplay
} from 'rxjs'
import type { DefinePluginConfig } from '../../../lib/core-types'
import { defineGridPlugin } from '../../../lib/core'
import { DEFAULT_BARS_TRIANGLE_PARAMS } from '../defaults'
import { LAYER_INDEX_OF_GRAPHIC } from '../../const'
import { createBaseBarsTriangle } from '../../base/BaseBarsTriangle'

const pluginName = 'BarsTriangle'

const pluginConfig: DefinePluginConfig<typeof pluginName, typeof DEFAULT_BARS_TRIANGLE_PARAMS> = {
  name: pluginName,
  defaultParams: DEFAULT_BARS_TRIANGLE_PARAMS,
  layerIndex: 5,
  validator: (params, { validateColumns }) => {
    const result = validateColumns(params, {
      barWidth: {
        toBeTypes: ['number']
      },
      barPadding: {
        toBeTypes: ['number']
      },
      barGroupPadding: {
        toBeTypes: ['number']
      },
      linearGradientOpacity: {
        toBe: '[number, number]',
        test: (value: any) => {
          return Array.isArray(value)
            && value.length === 2
            && typeof value[0] === 'number'
            && typeof value[1] === 'number'
        }
      }
    })
    return result
  }
}

export const BarsTriangle = defineGridPlugin(pluginConfig)(({ selection, name, subject, observer }) => {
  const destroy$ = new Subject()

  const unsubscribeBaseBars = createBaseBarsTriangle(pluginName, {
    selection,
    computedData$: observer.computedData$,
    computedAxesData$: observer.computedAxesData$,
    visibleComputedData$: observer.visibleComputedData$,
    visibleComputedAxesData$: observer.visibleComputedAxesData$,
    fullDataFormatter$: observer.fullDataFormatter$,
    seriesLabels$: observer.seriesLabels$,
    SeriesDataMap$: observer.SeriesDataMap$,
    GroupDataMap$: observer.GroupDataMap$,
    fullParams$: observer.fullParams$,
    fullChartParams$: observer.fullChartParams$,
    gridAxesTransform$: observer.gridAxesTransform$,
    gridGraphicTransform$: observer.gridGraphicTransform$,
    gridAxesSize$: observer.gridAxesSize$,
    gridHighlight$: observer.gridHighlight$,
    gridContainerPosition$: observer.gridContainerPosition$,
    isSeriesSeprate$: observer.isSeriesSeprate$,
    event$: subject.event$,
  })

  return () => {
    destroy$.next(undefined)
    unsubscribeBaseBars()
  }
})