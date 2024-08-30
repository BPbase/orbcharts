import {
  Subject,
  Observable } from 'rxjs'
import {
  defineGridPlugin } from '@orbcharts/core'
import { DEFAULT_BARS_PARAMS } from '../defaults'
import { createBaseBars } from '../../base/BaseBars'

const pluginName = 'Bars'

export const Bars = defineGridPlugin(pluginName, DEFAULT_BARS_PARAMS)(({ selection, name, subject, observer }) => {
  const destroy$ = new Subject()

  const unsubscribeBaseBars = createBaseBars(pluginName, {
    selection,
    computedData$: observer.computedData$,
    visibleComputedData$: observer.visibleComputedData$,
    existSeriesLabels$: observer.existSeriesLabels$,
    SeriesDataMap$: observer.SeriesDataMap$,
    GroupDataMap$: observer.GroupDataMap$,
    fullParams$: observer.fullParams$,
    fullChartParams$: observer.fullChartParams$,
    gridAxesTransform$: observer.gridAxesTransform$,
    gridGraphicTransform$: observer.gridGraphicTransform$,
    gridGraphicReverseScale$: observer.gridGraphicReverseScale$,
    gridAxesSize$: observer.gridAxesSize$,
    gridHighlight$: observer.gridHighlight$,
    gridContainer$: observer.gridContainer$,
    isSeriesPositionSeprate$: observer.isSeriesPositionSeprate$,
    event$: subject.event$,
  })

  return () => {
    destroy$.next(undefined)
    unsubscribeBaseBars()
  }
})
