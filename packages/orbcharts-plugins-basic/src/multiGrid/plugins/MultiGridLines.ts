import {
  Subject } from 'rxjs'
import {
  defineMultiGridPlugin } from '@orbcharts/core'

import { DEFAULT_MULTI_GRID_LINES_PARAMS } from '../defaults'
import { createBaseLines } from '../../base/BaseLines'
import { gridPluginObservables } from '../multiGridObservables'

const pluginName = 'MultiGridLines'

export const MultiGridLines = defineMultiGridPlugin(pluginName, DEFAULT_MULTI_GRID_LINES_PARAMS)(({ selection, name, subject, observer }) => {
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

  const unsubscribeBaseLines = createBaseLines(pluginName, {
    selection,
    computedData$: gridComputedData$,
    SeriesDataMap$: SeriesDataMap$,
    GroupDataMap$: GroupDataMap$,
    fullDataFormatter$: gridDataFormatter$,
    fullParams$: observer.fullParams$,
    fullChartParams$: observer.fullChartParams$,
    gridAxesTransform$: gridAxesTransform$,
    gridGraphicTransform$: gridGraphicTransform$,
    gridAxesSize$: gridAxesSize$,
    gridHighlight$: gridHighlight$,
    gridContainer$: gridContainer$,
    event$: subject.event$ as Subject<any>,
  })
  
  return () => {
    destroy$.next(undefined)
    unsubscribeBaseLines()
  }
})
