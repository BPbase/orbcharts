import {
  Subject } from 'rxjs'
import {
  defineMultiGridPlugin } from '@orbcharts/core'
import { DEFAULT_MULTI_GRID_BARS_PARAMS } from '../defaults'
import { createBaseBars } from '../../base/BaseBars'
import { gridPluginObservables } from '../multiGridObservables'

const pluginName = 'MultiGridBars'

export const MultiGridBars = defineMultiGridPlugin(pluginName, DEFAULT_MULTI_GRID_BARS_PARAMS)(({ selection, name, subject, observer }) => {
  const destroy$ = new Subject()

  const {
    gridComputedData$,
    gridDataFormatter$,
    gridAxesTransform$,
    gridGraphicTransform$,
    gridAxesOppositeTransform$,
    gridAxesSize$,
    gridHighlight$,
    SeriesDataMap$,
    GroupDataMap$,
    visibleComputedData$,
    isSeriesPositionSeprate$,
    gridContainer$
  } = gridPluginObservables(observer)

  const unsubscribeBaseBars = createBaseBars(pluginName, {
    selection,
    computedData$: gridComputedData$,
    visibleComputedData$: visibleComputedData$,
    SeriesDataMap$: SeriesDataMap$,
    GroupDataMap$: GroupDataMap$,
    fullParams$: observer.fullParams$,
    fullChartParams$: observer.fullChartParams$,
    gridAxesTransform$: gridAxesTransform$,
    gridGraphicTransform$: gridGraphicTransform$,
    gridAxesSize$: gridAxesSize$,
    gridHighlight$: gridHighlight$,
    gridContainer$: gridContainer$,
    isSeriesPositionSeprate$: isSeriesPositionSeprate$,
    event$: subject.event$ as Subject<any>,
  })

  
  return () => {
    destroy$.next(undefined)
    unsubscribeBaseBars()
  }
})
