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
  validator: (params) => {
    return {
      status: 'success',
      message: ''
    }
  }
}

export const BarsTriangle = defineGridPlugin(pluginConfig)(({ selection, name, subject, observer }) => {
  const destroy$ = new Subject()

  const unsubscribeBaseBars = createBaseBarsTriangle(pluginName, {
    selection,
    computedData$: observer.computedData$,
    computedLayoutData$: observer.computedLayoutData$,
    visibleComputedData$: observer.visibleComputedData$,
    visibleComputedLayoutData$: observer.visibleComputedLayoutData$,
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