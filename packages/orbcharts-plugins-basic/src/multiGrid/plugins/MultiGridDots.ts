import {
  Subject } from 'rxjs'
import {
  defineMultiGridPlugin } from '@orbcharts/core'
import { DEFAULT_MULTI_GRID_DOTS_PARAMS } from '../defaults'
import { createBaseDots } from '../../base/BaseDots'
import { gridPluginObservables } from '../multiGridObservables'

const pluginName = 'MultiGridDots'

export const MultiGridDots = defineMultiGridPlugin(pluginName, DEFAULT_MULTI_GRID_DOTS_PARAMS)(({ selection, name, subject, observer }) => {
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

  const unsubscribeBaseBars = createBaseDots(pluginName, {
    selection,
    computedData$: gridComputedData$,
    visibleComputedData$: visibleComputedData$,
    existedSeriesLabels$: existedSeriesLabels$,
    SeriesDataMap$: SeriesDataMap$,
    GroupDataMap$: GroupDataMap$,
    fullParams$: observer.fullParams$,
    fullChartParams$: observer.fullChartParams$,
    gridAxesTransform$: gridAxesTransform$,
    gridGraphicTransform$: gridGraphicTransform$,
    gridGraphicReverseScale$: gridGraphicReverseScale$,
    gridAxesSize$: gridAxesSize$,
    gridHighlight$: gridHighlight$,
    gridContainer$: gridContainer$,
    event$: subject.event$ as Subject<any>,
  })

  
  return () => {
    destroy$.next(undefined)
    unsubscribeBaseBars()
  }
})
