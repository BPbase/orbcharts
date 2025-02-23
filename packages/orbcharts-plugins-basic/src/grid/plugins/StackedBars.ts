import {
  map,
  distinctUntilChanged,
  shareReplay,
  takeUntil,
  Subject,
  Observable } from 'rxjs'
import type { DefinePluginConfig } from '../../../lib/core-types'
import { defineGridPlugin } from '../../../lib/core'
import { DEFAULT_STACKED_BARS_PARAMS } from '../defaults'
import { LAYER_INDEX_OF_GRAPHIC } from '../../const'
import { createBaseStackedBars } from '../../base/BaseStackedBars'

const pluginName = 'StackedBars'

const pluginConfig: DefinePluginConfig<typeof pluginName, typeof DEFAULT_STACKED_BARS_PARAMS> = {
  name: pluginName,
  defaultParams: DEFAULT_STACKED_BARS_PARAMS,
  layerIndex: 5,
  validator: (params, { validateColumns }) => {
    const result = validateColumns(params, {
      barWidth: {
        toBeTypes: ['number']
      },
      barGroupPadding: {
        toBeTypes: ['number']
      },
      barRadius: {
        toBeTypes: ['number', 'boolean']
      }
    })
    return result
  }
}

export const StackedBars = defineGridPlugin(pluginConfig)(({ selection, name, subject, observer }) => {
  const destroy$ = new Subject()

  const unsubscribeBaseBars = createBaseStackedBars(pluginName, {
    selection,
    computedData$: observer.computedData$,
    computedAxesData$: observer.computedAxesData$,
    visibleComputedData$: observer.visibleComputedData$,
    visibleComputedAxesData$: observer.visibleComputedAxesData$,
    seriesLabels$: observer.seriesLabels$,
    SeriesDataMap$: observer.SeriesDataMap$,
    GroupDataMap$: observer.GroupDataMap$,
    fullParams$: observer.fullParams$,
    fullDataFormatter$: observer.fullDataFormatter$,
    fullChartParams$: observer.fullChartParams$,
    gridAxesTransform$: observer.gridAxesTransform$,
    gridGraphicTransform$: observer.gridGraphicTransform$,
    gridGraphicReverseScale$: observer.gridGraphicReverseScale$,
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