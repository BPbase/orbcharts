import {
  Subject } from 'rxjs'
import {
  defineMultiGridPlugin } from '@orbcharts/core'
import { DEFAULT_MULTI_GRID_BARS_TRIANGLE_PARAMS } from '../defaults'
import { createBaseBarsTriangle } from '../../base/BaseBarsTriangle'
import { gridPluginObservables } from '../multiGridObservables'

const pluginName = 'MultiGridBarsTriangle'

export const MultiGridBarsTriangle = defineMultiGridPlugin(pluginName, DEFAULT_MULTI_GRID_BARS_TRIANGLE_PARAMS)(({ selection, name, subject, observer }) => {
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

  const unsubscribeBaseBarStack = createBaseBarsTriangle(pluginName, {
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
    unsubscribeBaseBarStack()
  }
})
