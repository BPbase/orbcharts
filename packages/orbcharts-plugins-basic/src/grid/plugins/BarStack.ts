import {
  map,
  distinctUntilChanged,
  shareReplay,
  takeUntil,
  Subject,
  Observable } from 'rxjs'
import type { DefinePluginConfig } from '../../../lib/core-types'
import { defineGridPlugin } from '../../../lib/core'
import { DEFAULT_BAR_STACK_PARAMS } from '../defaults'
import { LAYER_INDEX_OF_GRAPHIC } from '../../const'
import { createBaseBarStack } from '../../base/BaseBarStack'

const pluginName = 'BarStack'

const pluginConfig: DefinePluginConfig<typeof pluginName, typeof DEFAULT_BAR_STACK_PARAMS> = {
  name: pluginName,
  defaultParams: DEFAULT_BAR_STACK_PARAMS,
  layerIndex: 5,
  validator: (params) => {
    return {
      status: 'success',
      message: ''
    }
  }
}

export const BarStack = defineGridPlugin(pluginConfig)(({ selection, name, subject, observer }) => {
  const destroy$ = new Subject()

  const unsubscribeBaseBars = createBaseBarStack(pluginName, {
    selection,
    computedData$: observer.computedData$,
    computedLayoutData$: observer.computedLayoutData$,
    visibleComputedData$: observer.visibleComputedData$,
    visibleComputedLayoutData$: observer.visibleComputedLayoutData$,
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