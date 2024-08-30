import {
  Subject,
  Observable } from 'rxjs'
import { defineGridPlugin } from '@orbcharts/core'
import { DEFAULT_BAR_STACK_PARAMS } from '../defaults'
import { createBaseBarStack } from '../../base/BaseBarStack'

const pluginName = 'BarStack'


export const BarStack = defineGridPlugin(pluginName, DEFAULT_BAR_STACK_PARAMS)(({ selection, name, subject, observer }) => {
  const destroy$ = new Subject()

  const unsubscribeBaseBars = createBaseBarStack(pluginName, {
    selection,
    computedData$: observer.computedData$,
    visibleComputedData$: observer.visibleComputedData$,
    existSeriesLabels$: observer.existSeriesLabels$,
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
    gridContainer$: observer.gridContainer$,
    isSeriesPositionSeprate$: observer.isSeriesPositionSeprate$,
    event$: subject.event$,
  })

  return () => {
    destroy$.next(undefined)
    unsubscribeBaseBars()
  }
})