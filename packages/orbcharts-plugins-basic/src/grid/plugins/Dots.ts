import {
  Subject } from 'rxjs'
import {
  defineGridPlugin } from '@orbcharts/core'
import { DEFAULT_DOTS_PARAMS } from '../defaults'
import { createBaseDots } from '../../base/BaseDots'

const pluginName = 'Dots'

export const Dots = defineGridPlugin(pluginName, DEFAULT_DOTS_PARAMS)(({ selection, name, subject, observer }) => {
  
  const destroy$ = new Subject()

  const unsubscribeBaseBars = createBaseDots(pluginName, {
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
    event$: subject.event$,
  })

  return () => {
    destroy$.next(undefined)
    unsubscribeBaseBars()
  }
})