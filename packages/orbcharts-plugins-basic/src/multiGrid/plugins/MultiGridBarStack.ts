import {
  Subject } from 'rxjs'
import {
  defineMultiGridPlugin } from '@orbcharts/core'
import { DEFAULT_MULTI_GRID_BAR_STACK_PARAMS } from '../defaults'
import { createBaseBarStack } from '../../base/BaseBarStack'
import { gridPluginObservables } from '../multiGridObservables'

const pluginName = 'MultiGridBarStack'

export const MultiGridBarStack = defineMultiGridPlugin(pluginName, DEFAULT_MULTI_GRID_BAR_STACK_PARAMS)(({ selection, name, subject, observer }) => {
  const destroy$ = new Subject()

  const {
    gridComputedData$,
    gridDataFormatter$,
    gridAxesTransform$,
    gridGraphicTransform$,
    gridGraphicReverseScale$,
    gridAxesReverseTransform$,
    gridAxesSize$,
    gridHighlight$,
    existedSeriesLabels$,
    SeriesDataMap$,
    GroupDataMap$,
    visibleComputedData$,
    isSeriesPositionSeprate$,
    gridContainer$
  } = gridPluginObservables(observer)

  const unsubscribeBaseBarStack = createBaseBarStack(pluginName, {
    selection,
    computedData$: gridComputedData$,
    visibleComputedData$: visibleComputedData$,
    existedSeriesLabels$: existedSeriesLabels$,
    SeriesDataMap$: SeriesDataMap$,
    GroupDataMap$: GroupDataMap$,
    fullParams$: observer.fullParams$,
    fullDataFormatter$: gridDataFormatter$,
    fullChartParams$: observer.fullChartParams$,
    gridAxesTransform$: gridAxesTransform$,
    gridGraphicTransform$: gridGraphicTransform$,
    gridGraphicReverseScale$: gridGraphicReverseScale$,
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
