import {
  Subject,
  Observable } from 'rxjs'
import { defineGridPlugin } from '@orbcharts/core'
import { DEFAULT_BAR_STACK_PLUGIN_PARAMS } from '../defaults'
import { createBaseBarStack } from '../../base/BaseBarStack'

const pluginName = 'BarStack'


export const BarStack = defineGridPlugin(pluginName, DEFAULT_BAR_STACK_PLUGIN_PARAMS)(({ selection, name, subject, observer }) => {
  const destroy$ = new Subject()

  const unsubscribeBaseBars = createBaseBarStack(pluginName, {
    selection,
    computedData$: observer.computedData$,
    visibleComputedData$: observer.visibleComputedData$,
    SeriesDataMap$: observer.SeriesDataMap$,
    GroupDataMap$: observer.GroupDataMap$,
    fullParams$: observer.fullParams$,
    fullDataFormatter$: observer.fullDataFormatter$,
    fullChartParams$: observer.fullChartParams$,
    gridAxesTransform$: observer.gridAxesTransform$,
    gridGraphicTransform$: observer.gridGraphicTransform$,
    gridAxesSize$: observer.gridAxesSize$,
    gridHighlight$: observer.gridHighlight$,
    event$: subject.event$,
  })

  return () => {
    destroy$.next(undefined)
    unsubscribeBaseBars()
  }
})